import IOWorkspaces from '@interopio/workspaces-api';
import IOBrowser from '@interopio/browser';

const start = async () => {

    const clientConfig = {
        libraries: [IOWorkspaces]
    };

    const io = await IOBrowser(clientConfig);

    window.io = io;

    console.log('Client List App Started');
};

window.clientStart = start().catch(console.error);
