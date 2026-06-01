import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import IOBrowser from "@interopio/browser";
import { provideIoAssist } from "@interopio/io-assist-ng";
import { IoIntelWorkingContextFactory } from "@interopio/working-context";
import IOWorkspaces from "@interopio/workspaces-api";

const AGENT_SERVER_URL = "http://localhost:4111";
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

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideIoAssist({
            connectConfig: {
                browser: {
                    factory: IOBrowser,
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
                        capabilities: {},
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
