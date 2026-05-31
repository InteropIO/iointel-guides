import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import IOBrowser from "@interopio/browser";
import { provideIoAssist } from "@interopio/io-assist-ng";

const AGENT_SERVER_URL = "http://localhost:4111";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideIoAssist({
            connectConfig: {
                browser: {
                    factory: IOBrowser,
                    config: {
                        modals: {
                            dialogs: {
                                enabled: true,
                            },
                        },
                    },
                },
            },
            defaultAgentName: "io-agent",
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
