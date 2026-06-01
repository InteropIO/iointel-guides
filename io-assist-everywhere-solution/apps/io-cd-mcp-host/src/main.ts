import IODesktop from "@interopio/desktop";
import IOWorkspaces from "@interopio/workspaces-api";
import { clients, GET_CLIENTS_METHOD } from "./clients";
import { startMCPWebServer } from "./mcp";

const start = async () => {
    const io = await IODesktop({
        libraries: [IOWorkspaces]
    });

    await io.interop.register(GET_CLIENTS_METHOD, () => ({
        clients
    }));

    await startMCPWebServer(io);

    window.io = io;

    console.log("io.Connect Desktop MCP host started");
};

start().catch((error) => {
    console.error("Failed to start io.Connect Desktop MCP host", error);
});
