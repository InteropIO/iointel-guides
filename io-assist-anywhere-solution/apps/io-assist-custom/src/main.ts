import IOBrowser from "@interopio/browser";
import IOWorkspaces from "@interopio/workspaces-api";
import { createCustomAssistant, type CustomAssistant } from "./ai-web";
import { createChatView } from "./chat-view";
import { showConfirmDialog, showElicitationDialog } from "./dialogs";
import { startMCPWebServer } from "./mcp";
import "./styles.css";

const view = createChatView();
let assistant: CustomAssistant | undefined;
let isStreaming = false;

view.onSubmit((text) => {
    void sendUserMessage(text);
});

void initialize();

async function initialize(): Promise<void> {
    try {
        view.setStatus("Connecting");

        const io = await IOBrowser({
            libraries: [IOWorkspaces],
        });

        window.io = io;

        await startMCPWebServer(io);

        assistant = await createCustomAssistant({
            io,
            view,
            onMCPAppMessage: (text) => void sendUserMessage(text),
            showConfirmDialog,
            showElicitationDialog,
        });

        view.addMessage({
            role: "system",
            content: `Connected to ${assistant.agentName}. ${assistant.toolCount} MCP tools available.`,
        });
        view.setStatus("Ready");
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to start the custom assistant.";
        view.addMessage({ role: "system", content: message });
        view.setStatus("Error");
    }
}

async function sendUserMessage(text: string): Promise<void> {
    if (isStreaming) {
        return;
    }

    if (!assistant) {
        view.addMessage({ role: "system", content: "The assistant is not ready yet." });
        return;
    }

    isStreaming = true;
    view.setStreaming(true);

    const userMessageId = crypto.randomUUID();
    view.addMessage({ id: userMessageId, role: "user", content: text });

    try {
        await assistant.sendMessage(text, userMessageId);
    } catch (error) {
        const message = error instanceof Error ? error.message : "The assistant response failed.";
        view.addMessage({ role: "system", content: message });
    } finally {
        isStreaming = false;
        view.setStreaming(false);
    }
}
