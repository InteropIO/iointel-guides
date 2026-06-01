export const AGENT_SERVER_URL = "http://localhost:4111";
export const MCP_SANDBOX_PROXY_URL = "https://iointel-demos-mcp-apps-proxy.interop.io";
export const DEFAULT_AGENT_NAME = "io-agent";
export const USER_ID = "acme-custom-advisor";

export const WORKING_CONTEXT_CONFIG = {
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
