export type MessageRole = "user" | "assistant" | "system" | "tool";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    detail?: string;
}

export type MessagePatch = Partial<Pick<ChatMessage, "content" | "detail">>;

export interface AssistantView {
    addMessage(message: Omit<ChatMessage, "id"> & { id?: string }): void;
    appendToMessage(id: string, delta: string): void;
    updateMessage(id: string, patch: MessagePatch): void;
}
