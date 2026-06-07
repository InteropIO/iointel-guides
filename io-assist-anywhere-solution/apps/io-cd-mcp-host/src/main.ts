import IODesktop from "@interopio/desktop";
import IOWorkspaces from "@interopio/workspaces-api";
// Chapter 10 moves this logic to the dedicated MCP HTTP server.
// Keep the imports and startup calls here as comments so you can see how the guide progressed.
//
// import { clients, GET_CLIENTS_METHOD } from "./clients";
// import { startMCPWebServer } from "./mcp";

const start = async () => {
    const io = await IODesktop({
        libraries: [IOWorkspaces]
    });

    // await io.interop.register(GET_CLIENTS_METHOD, () => ({
    //     clients
    // }));
    //
    // await startMCPWebServer(io);

    window.io = io;

    console.log("io.Connect Desktop MCP Web host skipped. Chapter 10 uses the dedicated MCP HTTP server.");
};

start().catch((error) => {
    console.error("Failed to start io.Connect Desktop MCP host", error);
});
