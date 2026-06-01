import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import IOBrowser from "@interopio/browser";
import { provideIoAssist } from "@interopio/io-assist-ng";
import { IoIntelWorkingContextFactory } from "@interopio/working-context";
import IOWorkspaces from "@interopio/workspaces-api";
import { startMCPWebServer } from "./mcp";

const AGENT_SERVER_URL = "http://localhost:4111";
const MCP_SANDBOX_PROXY_URL = "https://iointel-demos-mcp-apps-proxy.interop.io";
const WORKING_CONTEXT_CONFIG = {
    schema: {
        selectedClient: {
            type: "object",
            description: "The ACME Banking client currently selected in the workspace.",
            source: {
                context: {
                    location: { workspace: { target: "my" } },
                    path: "selectedClient",
                },
            },
        },
    },
} as const;

const createIOConnect: typeof IOBrowser = async (config) => {
    const io = await IOBrowser(config);

    await startMCPWebServer(io);

    return io;
};

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideIoAssist({
            connectConfig: {
                browser: {
                    factory: createIOConnect,
                    config: {
                        libraries: [IOWorkspaces],
                        modals: {
                            dialogs: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
            defaultAgentName: "io-agent",
            workingContext: {
                factory: IoIntelWorkingContextFactory,
                config: WORKING_CONTEXT_CONFIG,
            },
            aiWebConfig: {
                agentServer: {
                    baseUrl: AGENT_SERVER_URL,
                },
                mcp: {
                    clientsConfig: {
                        enforceStrictCapabilities: false,
                        capabilities: {
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
            },
        }),
    ],
};
