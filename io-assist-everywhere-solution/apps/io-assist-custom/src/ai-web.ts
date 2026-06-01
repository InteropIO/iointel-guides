import { IoAiWebFactory, type IoAiWeb } from "@interopio/ai-web";
import { IoIntelWorkingContextFactory } from "@interopio/working-context";
import { AGENT_SERVER_URL, DEFAULT_AGENT_NAME, MCP_SANDBOX_PROXY_URL, USER_ID, WORKING_CONTEXT_CONFIG } from "./config";
import type { AssistantView, IOConnectAPI, StreamEvent } from "./types";
import { getText, parseJSON, parseToolResult, stringify } from "./utils";

export interface CustomAssistant {
    agentName: string;
    toolCount: number;
    sendMessage(text: string, userMessageId: string): Promise<void>;
}

export interface CustomAssistantOptions {
    io: IOConnectAPI;
    view: AssistantView;
    onMCPAppMessage(text: string): void;
    showConfirmDialog(params: {
        title: string;
        message: string;
        confirmText: string;
        cancelText: string;
    }): Promise<boolean>;
    showElicitationDialog(
        serverName: string,
        request: IoAiWeb.ElicitationRequestParams,
    ): Promise<IoAiWeb.ElicitationResponse>;
}

export async function createCustomAssistant(options: CustomAssistantOptions): Promise<CustomAssistant> {
    let selectedAgent: IoAiWeb.Agents.Agent | undefined;

    const aiWeb = await IoAiWebFactory(options.io, {
        agentServer: {
            baseUrl: AGENT_SERVER_URL,
        },
        context: {
            factory: IoIntelWorkingContextFactory,
            config: WORKING_CONTEXT_CONFIG,
        },
        mcp: {
            clientsConfig: {
                enforceStrictCapabilities: false,
                capabilities: {
                    sampling: {
                        handler: (serverName, request) => handleSamplingRequest(serverName, request, selectedAgent, options.showConfirmDialog),
                    },
                    elicitation: {
                        handler: options.showElicitationDialog,
                    },
                    extensions: {
                        "io.modelcontextprotocol/ui": {
                            mimeTypes: ["text/html;profile=mcp-app"],
                        },
                    },
                },
            },
            mcpApps: {
                sandboxProxyUrl: MCP_SANDBOX_PROXY_URL,
                displayMode: "workspace",
            },
            ioIntel: {
                web: {
                    enabled: true,
                },
            },
        },
    });

    window.aiWeb = aiWeb;
    wireMCPAppEvents(aiWeb, options);

    const agents = await aiWeb.agents.list();
    selectedAgent = agents.find((agent) => agent.name === DEFAULT_AGENT_NAME) ?? agents[0];

    if (!selectedAgent) {
        throw new Error("No agent is available.");
    }

    const tools = await aiWeb.tools.list();
    const threadId = crypto.randomUUID();

    return {
        agentName: selectedAgent.name,
        toolCount: tools.length,
        sendMessage: (text, userMessageId) => streamUserMessage(selectedAgent, text, userMessageId, threadId, options.view),
    };
}

async function streamUserMessage(
    agent: IoAiWeb.Agents.Agent,
    text: string,
    userMessageId: string,
    threadId: string,
    view: AssistantView,
): Promise<void> {
    const run = await agent.stream({
        messages: [
            {
                id: userMessageId,
                role: "user",
                content: text,
            },
        ],
        memory: {
            thread: threadId,
            resource: USER_ID,
        },
        resourceId: USER_ID,
        tools: {
            autoIncludeEnabled: true,
        },
    });

    await processResponseStream(run, view);
}

function processResponseStream(run: IoAiWeb.Agents.StreamResponse, view: AssistantView): Promise<void> {
    let assistantMessageId = "";
    let toolCallId = "";
    const toolCallArgs = new Map<string, string>();

    return new Promise((resolve, reject) => {
        const subscription = run.subscribe({
            next: (event: IoAiWeb.Agents.StreamEvent) => {
                const streamEvent = event as StreamEvent;

                switch (streamEvent.type) {
                    case "TEXT_MESSAGE_START":
                        assistantMessageId = streamEvent.messageId ?? crypto.randomUUID();
                        view.addMessage({
                            id: assistantMessageId,
                            role: "assistant",
                            content: "",
                        });
                        break;

                    case "TEXT_MESSAGE_CONTENT":
                    case "TEXT_MESSAGE_CHUNK": {
                        if (!assistantMessageId) {
                            assistantMessageId = streamEvent.messageId ?? crypto.randomUUID();
                            view.addMessage({
                                id: assistantMessageId,
                                role: "assistant",
                                content: "",
                            });
                        }

                        view.appendToMessage(assistantMessageId, streamEvent.delta ?? getText(streamEvent.content));
                        break;
                    }

                    case "TOOL_CALL_START":
                        toolCallId = streamEvent.toolCallId ?? crypto.randomUUID();
                        toolCallArgs.set(toolCallId, "");
                        view.addMessage({
                            id: toolCallId,
                            role: "tool",
                            content: `Using ${streamEvent.toolCallName ?? "tool"}`,
                        });
                        break;

                    case "TOOL_CALL_ARGS":
                        if (streamEvent.toolCallId) {
                            const current = toolCallArgs.get(streamEvent.toolCallId) ?? "";
                            toolCallArgs.set(streamEvent.toolCallId, current + (streamEvent.delta ?? ""));
                        }
                        break;

                    case "TOOL_CALL_END": {
                        const endedToolCallId = streamEvent.toolCallId ?? toolCallId;
                        const args = parseJSON(toolCallArgs.get(endedToolCallId) ?? "{}");
                        view.updateMessage(endedToolCallId, {
                            detail: `Input: ${stringify(args)}`,
                        });
                        break;
                    }

                    case "TOOL_CALL_RESULT": {
                        const resultToolCallId = streamEvent.toolCallId ?? toolCallId;
                        view.updateMessage(resultToolCallId, {
                            detail: `Result: ${stringify(parseToolResult(streamEvent.content))}`,
                        });
                        break;
                    }

                    case "RUN_ERROR":
                        view.addMessage({ role: "system", content: stringify(streamEvent) });
                        break;
                }
            },
            error: (error: Error) => {
                subscription.unsubscribe();
                reject(error);
            },
            abort: () => {
                subscription.unsubscribe();
                resolve();
            },
            complete: () => {
                subscription.unsubscribe();
                resolve();
            },
        });
    });
}

async function handleSamplingRequest(
    serverName: string,
    request: IoAiWeb.SamplingRequestParams,
    agent: IoAiWeb.Agents.Agent | undefined,
    showConfirmDialog: CustomAssistantOptions["showConfirmDialog"],
): Promise<IoAiWeb.SamplingSuccessResponse | IoAiWeb.SamplingErrorResponse> {
    const accepted = await showConfirmDialog({
        title: "Sampling request",
        message: `${serverName} is asking the assistant to generate a supporting response.`,
        confirmText: "Continue",
        cancelText: "Cancel",
    });

    if (!accepted) {
        return { code: -1, message: "Sampling request canceled by the user." };
    }

    if (!agent) {
        return { code: -1, message: "No agent is available for sampling." };
    }

    const messages = request.messages.map<IoAiWeb.Agents.AgentMessage>((message) => ({
        id: crypto.randomUUID(),
        role: message.role,
        content: getText(message.content),
    }));

    if (request.systemPrompt) {
        messages.unshift({
            id: crypto.randomUUID(),
            role: "system",
            content: request.systemPrompt,
        });
    }

    const response = await agent.generate({
        messages,
        tools: {
            autoIncludeEnabled: false,
        },
        ...(request._meta?.structuredOutput
            ? {
                structuredOutput: {
                    schema: request._meta.structuredOutput,
                },
            }
            : {}),
    });

    return {
        model: agent.modelId || "unknown",
        role: "assistant",
        content: {
            type: "text",
            text: response.text ?? "",
        },
        stopReason: "endTurn",
    };
}

function wireMCPAppEvents(aiWeb: IoAiWeb.API, options: CustomAssistantOptions): void {
    if (!aiWeb.mcpApps) {
        return;
    }

    aiWeb.mcpApps.onAppCreated((app) => {
        options.view.addMessage({
            role: "system",
            content: "Opened an MCP App preview for this chat.",
        });

        app.onMessage((text) => {
            options.onMCPAppMessage(text);
        });
    });

    aiWeb.mcpApps.onRecreateRequested((event) => {
        void options.showConfirmDialog({
            title: "Replace preview",
            message: `${event.toolName} already has a preview. Replace it?`,
            confirmText: "Replace",
            cancelText: "Open new",
        }).then((replace) => event.select(replace ? "recreate" : "newInstance"));
    });
}
