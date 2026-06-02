import IODesktop from "@interopio/desktop";
import IoIntelMCPHttpFactory from "@interopio/mcp-http";
import IOWorkspaces from "@interopio/workspaces-api";

const HTTP_PORT = 8989;
const GET_CLIENTS_METHOD = "getClients";

interface Client {
    id: string;
    portfolioId: string;
    firstName: string;
    lastName: string;
    segment: string;
    advisor: string;
    riskProfile: string;
}

const clients: Client[] = [
    {
        id: "CL-10024",
        portfolioId: "PF-8801",
        firstName: "Amelia",
        lastName: "Reed",
        segment: "Private Banking",
        advisor: "M. Carter",
        riskProfile: "Balanced"
    },
    {
        id: "CL-10031",
        portfolioId: "PF-8817",
        firstName: "Daniel",
        lastName: "Kovacs",
        segment: "Wealth",
        advisor: "S. Ivanova",
        riskProfile: "Growth"
    },
    {
        id: "CL-10047",
        portfolioId: "PF-8840",
        firstName: "Sophia",
        lastName: "Bennett",
        segment: "Retail Plus",
        advisor: "L. Morgan",
        riskProfile: "Conservative"
    },
    {
        id: "CL-10058",
        portfolioId: "PF-8862",
        firstName: "Marcus",
        lastName: "Hale",
        segment: "Private Banking",
        advisor: "M. Carter",
        riskProfile: "Income"
    },
    {
        id: "CL-10073",
        portfolioId: "PF-8894",
        firstName: "Elena",
        lastName: "Petrova",
        segment: "Wealth",
        advisor: "S. Ivanova",
        riskProfile: "Balanced"
    }
];

const getClientsTool = {
    availability: "constant" as const,
    name: "get_clients",
    config: {
        title: "Get Clients",
        description: "Returns the list of ACME Banking clients available in io.Connect Desktop. This list contains all the information about the clients that io.Connect Desktop has access to, including their id, portfolioId, firstName, lastName, segment, advisor, and riskProfile. This tool does not take any input parameters and will return an array of client objects.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
            required: []
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
};

const start = async (): Promise<void> => {
    const licenseKey = process.env.VITE_IO_INTELLIGENCE_LICENSE_KEY;

    if (!licenseKey) {
        throw new Error("Missing VITE_IO_INTELLIGENCE_LICENSE_KEY. Add it to the root .env file before building.");
    }

    const io = await IODesktop({
        logger: "info",
        libraries: [IOWorkspaces]
    });

    await io.interop.register(GET_CLIENTS_METHOD, () => ({
        clients
    }));

    await IoIntelMCPHttpFactory(io, {
        licenseKey,
        server: {
            port: HTTP_PORT
        },
        mcpCoreServer: {
            tools: {
                static: {
                    methods: [getClientsTool]
                }
            }
        }
    });

    console.log(`ACME Banking MCP HTTP server started on http://localhost:${HTTP_PORT}/mcp`);
};

start().catch((error) => {
    console.error("Failed to start ACME Banking MCP HTTP server", error);
});
