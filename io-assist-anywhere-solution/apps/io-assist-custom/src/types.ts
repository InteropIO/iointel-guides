import type IOBrowser from "@interopio/browser";
import type { IoAiWeb } from "@interopio/ai-web";

export type IOConnectAPI = Awaited<ReturnType<typeof IOBrowser>>;
export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    detail?: string;
}

export type MessagePatch = Partial<Pick<ChatMessage, "content" | "detail">>;

export type StreamEventType = IoAiWeb.Agents.StreamEventType | "TEXT_MESSAGE_CHUNK";

export type StreamEvent = Omit<IoAiWeb.Agents.StreamEvent, "type"> & {
    type: StreamEventType;
    messageId?: string;
    delta?: string;
    content?: unknown;
    toolCallId?: string;
    toolCallName?: string;
};

export type ElicitationProperty = IoAiWeb.ElicitationSchemaType & {
    enum?: Array<string | number>;
    enumNames?: string[];
};

export interface AssistantView {
    addMessage(message: Omit<ChatMessage, "id"> & { id?: string }): void;
    appendToMessage(id: string, delta: string): void;
    updateMessage(id: string, patch: MessagePatch): void;
}

declare global {
    interface Window {
        io?: IOConnectAPI;
        aiWeb?: IoAiWeb.API;
    }
}
