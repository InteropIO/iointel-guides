import type { IOConnectDesktop } from "@interopio/desktop";
import { ServerFactory, type IoIntelMCPWeb } from "@interopio/mcp-web";
import { GET_CLIENTS_METHOD } from "./clients";

const GET_CLIENTS_TOOL = "get_clients";

const getMCPWebServerConfig = (): IoIntelMCPWeb.Server.Config => ({
    licenseKey: import.meta.env.VITE_IO_INTELLIGENCE_LICENSE_KEY,
    mcpCoreServer: {
        tools: {
            static: {
                methods: [
                    {
                        availability: "constant",
                        name: GET_CLIENTS_TOOL,
                        config: {
                            title: "Get Clients",
                            description: "Returns the list of ACME Banking clients available in io.Connect Desktop.",
                            inputSchema: {
                                type: "object",
                                properties: {},
                                additionalProperties: false
                            },
                            outputSchema: {
                                type: "object",
                                properties: {
                                    clients: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                id: { type: "string" },
                                                portfolioId: { type: "string" },
                                                firstName: { type: "string" },
                                                lastName: { type: "string" },
                                                segment: { type: "string" },
                                                advisor: { type: "string" },
                                                riskProfile: { type: "string" }
                                            },
                                            required: ["id", "portfolioId", "firstName", "lastName", "segment", "advisor", "riskProfile"]
                                        }
                                    }
                                },
                                required: ["clients"]
                            }
                        },
                        interop: {
                            methodName: GET_CLIENTS_METHOD
                        }
                    }
                ]
            }
        }
    }
});

export const startMCPWebServer = async (io: IOConnectDesktop.API): Promise<void> => {
    await ServerFactory(io, getMCPWebServerConfig());

    console.log("MCP Web server started in io.Connect Desktop host");
};
