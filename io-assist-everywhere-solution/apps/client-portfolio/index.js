import IOWorkspaces from '@interopio/workspaces-api';
import IOBrowser from '@interopio/browser';
import { goLondon } from './london.js';

const DISPLAY_CLIENT_PORTFOLIO_METHOD = 'ClientPortfolio.Display';

const portfolios = [
    {
        id: 'CL-10024',
        portfolioId: 'PF-8801',
        firstName: 'Amelia',
        lastName: 'Reed',
        segment: 'Private Banking',
        advisor: 'M. Carter',
        riskProfile: 'Balanced',
        totalValue: 1285000,
        cashBalance: 146000,
        yearToDateReturn: 6.8,
        holdings: [
            { name: 'Global Equity Fund', allocation: 42, value: 539700 },
            { name: 'Investment Grade Bonds', allocation: 31, value: 398350 },
            { name: 'Managed Alternatives', allocation: 16, value: 205600 },
            { name: 'Cash Reserve', allocation: 11, value: 141350 }
        ],
        activity: [
            { date: '2026-05-06', title: 'Quarterly rebalance completed', detail: 'Reduced equity overweight by 3%.' },
            { date: '2026-04-18', title: 'Advisor review', detail: 'Confirmed balanced risk profile.' }
        ]
    },
    {
        id: 'CL-10031',
        portfolioId: 'PF-8817',
        firstName: 'Daniel',
        lastName: 'Kovacs',
        segment: 'Wealth',
        advisor: 'S. Ivanova',
        riskProfile: 'Growth',
        totalValue: 874300,
        cashBalance: 58200,
        yearToDateReturn: 9.4,
        holdings: [
            { name: 'US Growth Strategy', allocation: 48, value: 419664 },
            { name: 'Technology Leaders Basket', allocation: 22, value: 192346 },
            { name: 'Global Equity Fund', allocation: 18, value: 157374 },
            { name: 'Cash Reserve', allocation: 12, value: 104916 }
        ],
        activity: [
            { date: '2026-05-09', title: 'New contribution received', detail: 'Added 25000 to cash reserve.' },
            { date: '2026-04-29', title: 'Risk review', detail: 'Growth mandate remains suitable.' }
        ]
    },
    {
        id: 'CL-10047',
        portfolioId: 'PF-8840',
        firstName: 'Sophia',
        lastName: 'Bennett',
        segment: 'Retail Plus',
        advisor: 'L. Morgan',
        riskProfile: 'Conservative',
        totalValue: 392800,
        cashBalance: 64700,
        yearToDateReturn: 3.1,
        holdings: [
            { name: 'Short Duration Bonds', allocation: 40, value: 157120 },
            { name: 'Dividend Income Fund', allocation: 28, value: 109984 },
            { name: 'Capital Preservation Fund', allocation: 19, value: 74632 },
            { name: 'Cash Reserve', allocation: 13, value: 51064 }
        ],
        activity: [
            { date: '2026-05-02', title: 'Income distribution paid', detail: 'Monthly distribution credited.' },
            { date: '2026-04-16', title: 'Portfolio note added', detail: 'Client prefers lower volatility.' }
        ]
    },
    {
        id: 'CL-10058',
        portfolioId: 'PF-8862',
        firstName: 'Marcus',
        lastName: 'Hale',
        segment: 'Private Banking',
        advisor: 'M. Carter',
        riskProfile: 'Income',
        totalValue: 1642000,
        cashBalance: 213500,
        yearToDateReturn: 4.7,
        holdings: [
            { name: 'Municipal Bond Ladder', allocation: 36, value: 591120 },
            { name: 'Dividend Income Fund', allocation: 26, value: 426920 },
            { name: 'Global Infrastructure Fund', allocation: 21, value: 344820 },
            { name: 'Cash Reserve', allocation: 17, value: 279140 }
        ],
        activity: [
            { date: '2026-05-03', title: 'Bond maturity processed', detail: 'Proceeds moved into cash reserve.' },
            { date: '2026-04-22', title: 'Income plan reviewed', detail: 'No changes requested.' }
        ]
    },
    {
        id: 'CL-10073',
        portfolioId: 'PF-8894',
        firstName: 'Elena',
        lastName: 'Petrova',
        segment: 'Wealth',
        advisor: 'S. Ivanova',
        riskProfile: 'Balanced',
        totalValue: 715600,
        cashBalance: 93600,
        yearToDateReturn: 5.9,
        holdings: [
            { name: 'Global Equity Fund', allocation: 38, value: 271928 },
            { name: 'Investment Grade Bonds', allocation: 29, value: 207524 },
            { name: 'European Dividend Fund', allocation: 20, value: 143120 },
            { name: 'Cash Reserve', allocation: 13, value: 93028 }
        ],
        activity: [
            { date: '2026-05-07', title: 'Tax report generated', detail: 'Report prepared for advisor review.' },
            { date: '2026-04-24', title: 'Portfolio review scheduled', detail: 'Client meeting set for next week.' }
        ]
    }
];

const state = {
    io: undefined,
    workspace: undefined,
    selectedClientId: undefined,
    workspaceContextUnsubscribe: undefined
};

const getElements = () => ({
    status: document.getElementById('status'),
    portfolioView: document.getElementById('portfolio-view')
});

const getClientName = (client) => `${client.firstName} ${client.lastName}`;

const findPortfolio = (clientId) => portfolios.find((portfolio) => portfolio.id === clientId || portfolio.portfolioId === clientId);

const getSelectedClientId = (context) => context?.selectedClient?.id || context?.selectedClient?.clientId;

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
}).format(value);

const setStatus = (message, tone = 'neutral') => {
    const { status } = getElements();

    status.textContent = message;
    status.dataset.tone = tone;
};

const renderEmptyState = () => {
    const { portfolioView } = getElements();

    portfolioView.innerHTML = `
        <div class="empty-state">
            <strong>No client selected</strong>
            <p>Select a client in the Client List app to load portfolio details here.</p>
        </div>
    `;
};

const renderPortfolio = (portfolio) => {
    const { portfolioView } = getElements();

    portfolioView.innerHTML = `
        <section class="client-summary" aria-label="Portfolio summary">
            <div class="summary-header">
                <div>
                    <h2>${getClientName(portfolio)}</h2>
                    <p class="client-meta">${portfolio.id} - ${portfolio.segment} - ${portfolio.portfolioId}</p>
                </div>
                <span class="risk-badge">${portfolio.riskProfile}</span>
            </div>

            <div class="metric-grid" aria-label="Portfolio metrics">
                <div class="metric">
                    <span class="metric-label">Total value</span>
                    <span class="metric-value">${formatCurrency(portfolio.totalValue)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Cash balance</span>
                    <span class="metric-value">${formatCurrency(portfolio.cashBalance)}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">YTD return</span>
                    <span class="metric-value positive">${portfolio.yearToDateReturn}%</span>
                </div>
            </div>
        </section>

        <section class="panel" aria-label="Holdings">
            <h3>Holdings</h3>
            <div class="holding-list">
                ${portfolio.holdings.map((holding) => `
                    <div class="holding-row">
                        <div class="holding-main">
                            <span class="holding-name">${holding.name}</span>
                            <span class="holding-value">${formatCurrency(holding.value)}</span>
                        </div>
                        <span class="holding-detail">${holding.allocation}% allocation</span>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="panel" aria-label="Recent activity">
            <h3>Recent Activity</h3>
            <div class="activity-list">
                ${portfolio.activity.map((activity) => `
                    <div class="activity-row">
                        <div class="activity-main">
                            <span class="activity-title">${activity.title}</span>
                            <span class="activity-date">${activity.date}</span>
                        </div>
                        <span class="activity-detail">${activity.detail}</span>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
};

const displayPortfolio = (clientId, source) => {
    const portfolio = findPortfolio(clientId);

    if (!portfolio) {
        state.selectedClientId = undefined;
        renderEmptyState();
        setStatus(`No portfolio found for client ${clientId}.`, 'error');
        return { ok: false, message: `No portfolio found for client ${clientId}.` };
    }

    state.selectedClientId = portfolio.id;
    renderPortfolio(portfolio);
    setStatus(`${getClientName(portfolio)} portfolio loaded from ${source}.`, 'success');

    return {
        ok: true,
        clientId: portfolio.id,
        portfolioId: portfolio.portfolioId,
        fullName: getClientName(portfolio)
    };
};

const syncFromWorkspaceContext = (context) => {
    const selectedClientId = getSelectedClientId(context);

    if (!selectedClientId) {
        return;
    }

    if (selectedClientId === state.selectedClientId) {
        return;
    }

    displayPortfolio(selectedClientId, 'workspace context');
};

const registerInteropMethods = async (io) => {
    await io.interop.register(DISPLAY_CLIENT_PORTFOLIO_METHOD, (args = {}) => {
        const clientId = args.clientId || args.id;

        if (!clientId) {
            return { ok: false, message: 'Provide a clientId or id.' };
        }

        return displayPortfolio(clientId, 'interop');
    });

    await goLondon(io);
};

const start = async () => {
    renderEmptyState();

    const clientConfig = {
        libraries: [IOWorkspaces]
    };

    const io = await IOBrowser(clientConfig);

    state.io = io;
    window.io = io;

    await registerInteropMethods(io);

    if (await io.workspaces.inWorkspace()) {
        state.workspace = await io.workspaces.getMyWorkspace();
        state.workspaceContextUnsubscribe = await state.workspace.onContextUpdated(syncFromWorkspaceContext);
        syncFromWorkspaceContext(await state.workspace.getContext());

        if (!state.selectedClientId) {
            setStatus('Waiting for a client selection from the workspace context.');
        }
    } else {
        setStatus('Running outside a workspace. Invoke ClientPortfolio.Display to load a portfolio.', 'warning');
    }

    console.log('Client Portfolio App Started');
};

window.clientStart = start().catch(console.error);
