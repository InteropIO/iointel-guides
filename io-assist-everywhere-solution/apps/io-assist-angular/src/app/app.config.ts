import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import IOBrowser from "@interopio/browser";
import { provideIoAssist } from "@interopio/io-assist-ng";
import { IoIntelWorkingContextFactory } from "@interopio/working-context";
import IOWorkspaces from "@interopio/workspaces-api";
import { startMCPWebServer } from "./mcp";

const AGENT_SERVER_URL = "http://localhost:4111";
const MCP_HTTP_SERVER_URL = "http://localhost:8989/mcp";
const MCP_SANDBOX_PROXY_URL = "https://iointel-demos-mcp-apps-proxy.interop.io";
const IS_IO_CONNECT_DESKTOP = Boolean((window as any).glue42gd || (window as any).iodesktop);
const IO_INTEL_MCP_CONFIG = IS_IO_CONNECT_DESKTOP
    ? {
        remote: {
            streamableHttp: {
                url: MCP_HTTP_SERVER_URL,
                name: "ACME Banking MCP HTTP",
            },
        },
        web: {
            enabled: false,
        },
    }
    : {
        web: {
            enabled: true,
        },
    };
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

    if (!IS_IO_CONNECT_DESKTOP) {
        await startMCPWebServer(io);
    }

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
                            enabled: false,
                        },
                    },
                    remoteServers: [
                        {
                            streamableHttp: {
                                url: 'http://localhost:3100/mcp',
                                name: 'codemode-mcp',
                            },
                        },
                    ],
                    // ioIntel: IO_INTEL_MCP_CONFIG,
                },
            },
        }),
    ],
};
