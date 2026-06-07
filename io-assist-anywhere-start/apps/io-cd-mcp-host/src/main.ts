import IODesktop from "@interopio/desktop";
import IOWorkspaces from "@interopio/workspaces-api";

const start = async () => {
    const io = await IODesktop({
        libraries: [IOWorkspaces]
    });

    window.io = io;

    console.log("io.Connect Desktop MCP host shell started");
};

start().catch((error) => {
    console.error("Failed to start io.Connect Desktop MCP host shell", error);
});
