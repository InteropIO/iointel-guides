import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
    server: {
        port: 4200,
        host: "localhost",
        cors: true,
    },

    plugins: [
        react(),
        EnvironmentPlugin(['VITE_LICENSE_KEY', 'VITE_IO_INTELLIGENCE_LICENSE_KEY'])
    ],
});
