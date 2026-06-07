import fs from "node:fs";
import path, { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const getFileContent = async (filePath) => {
    const fileExists = fs.existsSync(filePath);

    return fileExists ? (await fs.promises.readFile(filePath)).toString() : "";
};

const createLocalEnv = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const localEnvFileLocation = resolve(__dirname, "../.env");
    const rootEnvFileContent = await getFileContent(resolve(__dirname, "../../.env"));

    const ioIntelLicenseKey = rootEnvFileContent
        .split("\n")
        .map((line) => line.trim())
        .find((line) => line.startsWith("VITE_IO_INTELLIGENCE_LICENSE_KEY="));

    if (!ioIntelLicenseKey) {
        throw new Error("Please provide VITE_IO_INTELLIGENCE_LICENSE_KEY in the .env file of the project root directory.");
    }

    await fs.promises.writeFile(localEnvFileLocation, `${ioIntelLicenseKey}\n`, { encoding: "utf8" });
};

createLocalEnv().catch(console.error);
