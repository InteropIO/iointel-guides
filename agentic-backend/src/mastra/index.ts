import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { ioAgent } from './agents/io-agent';

export const mastra = new Mastra({
    agents: { ioAgent },
    storage: new LibSQLStore({
        id: 'mastra-storage',
        url: ':memory:'

    }),
    logger: new PinoLogger({
        name: 'Mastra',
        level: 'info'
    }),
});