import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { IoMastraBridgeFactory } from '@interopio/ai-mastra-bridge';
import { ioAgent } from './agents/io-agent';
import { DefaultExporter, MastraStorageExporter, Observability } from '@mastra/observability';
import { mastraLogger } from './logger';

const bridge = IoMastraBridgeFactory();

export const mastra = new Mastra({
    agents: { ioAgent },
    storage: new LibSQLStore({
        id: 'mastra-storage',
        url: 'file:./mastra.db', // Storage is required for tracing
    }),
    logger: mastraLogger,
    server: {
        apiRoutes: [...bridge.createHonoRoutes()]
    },
    observability: new Observability({
        configs: {
            default: {
                serviceName: 'io-assist-mastra',
                exporters: [
                    new DefaultExporter()
                ]
            }
        }
    }),
});
