import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LibSQLVector } from '@mastra/libsql';
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";

export const ioAgent = new Agent({
    id: 'io-agent',
    name: 'IO Agent',
    instructions: "",
    model: openai("gpt-5.2"),
    memory: new Memory({
        options: {
            generateTitle: true,
            lastMessages: 20,
            workingMemory: {
                enabled: true,
                scope: 'thread',
                template: `Important Details:\n\nKeep a short paragraph capturing the user's important facts (name, main goal, current task).`,
            },
            semanticRecall: {
                topK: 3,
                messageRange: 2,
                scope: 'thread',
            }
        },
        storage: new LibSQLStore({
            id: 'agent-storage',
            url: ':memory:'
        }),
        vector: new LibSQLVector({
            id: 'agent-vector',
            url: ':memory:'
        }),
        embedder: new ModelRouterEmbeddingModel("openai/text-embedding-3-small")
    }),
});
