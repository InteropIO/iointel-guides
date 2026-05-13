import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const ioAgent = new Agent({
    id: 'io-agent',
    name: 'IO Agent',
    instructions: "",
    model: anthropic("claude-opus-4-5"),
    memory: new Memory({
        options: {
            generateTitle: true,
            lastMessages: 20,
            workingMemory: {
                enabled: true,
                scope: 'thread',
                template: `Important Details:\n\nKeep a short paragraph capturing the user's important facts (name, main goal, current task).`,
            },
        },
        storage: new LibSQLStore({
            id: 'agent-storage',
            url: ':memory:'
        })
    }),
});
