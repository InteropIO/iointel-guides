const fs = require('fs');
const { resolve } = require('path');

const getFileContent = async (path) => {
    const fileExists = fs.existsSync(path);

    return fileExists ? (await fs.promises.readFile(path)).toString() : '';
};

const createLocalEnv = async () => {
    const localEnvFileLocation = resolve(__dirname, '../.env');

    const localEnvFileContent = await getFileContent(localEnvFileLocation);
    const rootEnvFileContent = await getFileContent(resolve(__dirname, '../../../.env'));

    const licenseKey = rootEnvFileContent
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line.startsWith('VITE_LICENSE_KEY='));

    if (!licenseKey) {
        throw new Error('Please provide LICENSE_KEY in the .env file of the root directory.');
    }

    const ioIntelLicenseKey = rootEnvFileContent
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line.startsWith('VITE_IO_INTELLIGENCE_LICENSE_KEY='));

    if (!ioIntelLicenseKey) {
        throw new Error('Please provide VITE_IO_INTELLIGENCE_LICENSE_KEY in the .env file of the root directory.');
    }

    await fs.promises.writeFile(localEnvFileLocation, [ioIntelLicenseKey, licenseKey].join('\n'), { encoding: 'utf8' });
};

createLocalEnv().catch(console.error);
