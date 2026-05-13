import IOWorkspaces from '@interopio/workspaces-api';
import IOBrowser from '@interopio/browser';

const clients = [
    {
        id: 'CL-10024',
        portfolioId: 'PF-8801',
        firstName: 'Amelia',
        lastName: 'Reed',
        segment: 'Private Banking',
        advisor: 'M. Carter',
        riskProfile: 'Balanced'
    },
    {
        id: 'CL-10031',
        portfolioId: 'PF-8817',
        firstName: 'Daniel',
        lastName: 'Kovacs',
        segment: 'Wealth',
        advisor: 'S. Ivanova',
        riskProfile: 'Growth'
    },
    {
        id: 'CL-10047',
        portfolioId: 'PF-8840',
        firstName: 'Sophia',
        lastName: 'Bennett',
        segment: 'Retail Plus',
        advisor: 'L. Morgan',
        riskProfile: 'Conservative'
    },
    {
        id: 'CL-10058',
        portfolioId: 'PF-8862',
        firstName: 'Marcus',
        lastName: 'Hale',
        segment: 'Private Banking',
        advisor: 'M. Carter',
        riskProfile: 'Income'
    },
    {
        id: 'CL-10073',
        portfolioId: 'PF-8894',
        firstName: 'Elena',
        lastName: 'Petrova',
        segment: 'Wealth',
        advisor: 'S. Ivanova',
        riskProfile: 'Balanced'
    }
];

const state = {
    io: undefined,
    workspace: undefined,
    selectedClientId: undefined
};

const getElements = () => ({
    count: document.getElementById('client-count'),
    list: document.getElementById('client-list'),
    status: document.getElementById('status')
});

const getClientName = (client) => `${client.firstName} ${client.lastName}`;

const toWorkspaceContext = (client) => ({
    selectedClient: {
        id: client.id,
        portfolioId: client.portfolioId,
        firstName: client.firstName,
        lastName: client.lastName,
        fullName: getClientName(client),
        segment: client.segment,
        advisor: client.advisor,
        riskProfile: client.riskProfile,
        selectedAt: new Date().toISOString()
    }
});

const setStatus = (message, tone = 'neutral') => {
    const { status } = getElements();

    status.textContent = message;
    status.dataset.tone = tone;
};

const renderClients = () => {
    const { count, list } = getElements();

    count.textContent = `${clients.length} clients`;
    list.innerHTML = '';

    clients.forEach((client) => {
        const button = document.createElement('button');
        const selected = client.id === state.selectedClientId;

        button.type = 'button';
        button.className = selected ? 'client-card selected' : 'client-card';
        button.setAttribute('aria-pressed', String(selected));

        button.innerHTML = `
            <span class="client-main">
                <span class="client-name">${getClientName(client)}</span>
                <span class="client-meta">${client.id} - ${client.segment}</span>
            </span>
            <span class="portfolio-id">${client.portfolioId}</span>
        `;

        button.addEventListener('click', () => selectClient(client));
        list.appendChild(button);
    });
};

const selectClient = async (client) => {
    state.selectedClientId = client.id;
    renderClients();

    if (!state.workspace) {
        setStatus(`${getClientName(client)} selected. Open this app in a workspace to share the client context.`, 'warning');
        return;
    }

    setStatus(`Saving ${getClientName(client)} to workspace context...`);

    try {
        await state.workspace.updateContext(toWorkspaceContext(client));
        setStatus(`${getClientName(client)} saved to workspace context.`, 'success');
    } catch (error) {
        console.error('Failed to update workspace context', error);
        setStatus('Could not update the workspace context. See the console for details.', 'error');
    }
};

const restoreSelectionFromWorkspace = async () => {
    if (!state.workspace) {
        return;
    }

    const context = await state.workspace.getContext();
    const selectedClientId = context?.selectedClient?.id;
    const knownClient = clients.find((client) => client.id === selectedClientId);

    if (knownClient) {
        state.selectedClientId = knownClient.id;
        renderClients();
        setStatus(`${getClientName(knownClient)} is selected in this workspace.`, 'success');
    }
};

const start = async () => {
    renderClients();

    const clientConfig = {
        libraries: [IOWorkspaces]
    };

    let io;

    try {
        io = await IOBrowser(clientConfig);
    } catch (error) {
        console.warn('io.Connect is not available. Open this app from the io.Connect Browser platform to share workspace context.', error);
        setStatus('Open this app from io.Connect Browser to share client context.', 'warning');
        return;
    }

    state.io = io;
    window.io = io;

    if (await io.workspaces.inWorkspace()) {
        state.workspace = await io.workspaces.getMyWorkspace();
        await restoreSelectionFromWorkspace();

        if (!state.selectedClientId) {
            setStatus('Select a client to share it with the workspace.');
        }
    } else {
        setStatus('Running outside a workspace. Client selection will stay local.', 'warning');
    }

    console.log('Client List App Started');
};

window.clientStart = start().catch(console.error);
