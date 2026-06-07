import type { ChatMessage, MessagePatch, MessageRole } from "./types";

type SubmitHandler = (text: string) => void;

export class ChatView {
    private readonly messages: ChatMessage[] = [];
    private submitHandler?: SubmitHandler;

    constructor(
        private readonly messagesElement: HTMLDivElement,
        private readonly statusElement: HTMLSpanElement,
        private readonly composerElement: HTMLFormElement,
        private readonly inputElement: HTMLTextAreaElement,
        private readonly sendButtonElement: HTMLButtonElement,
    ) {
        this.composerElement.addEventListener("submit", (event) => {
            event.preventDefault();
            this.submitMessage();
        });

        this.inputElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                this.submitMessage();
            }
        });
    }

    onSubmit(handler: SubmitHandler): void {
        this.submitHandler = handler;
    }

    addMessage(message: Omit<ChatMessage, "id"> & { id?: string }): void {
        this.messages.push({
            id: message.id ?? crypto.randomUUID(),
            role: message.role,
            content: message.content,
            detail: message.detail,
        });
        this.renderMessages();
    }

    appendToMessage(id: string, delta: string): void {
        if (!delta) {
            return;
        }

        const message = this.messages.find((item) => item.id === id);

        if (!message) {
            this.addMessage({ id, role: "assistant", content: delta });
            return;
        }

        message.content += delta;
        this.renderMessages();
    }

    updateMessage(id: string, patch: MessagePatch): void {
        const message = this.messages.find((item) => item.id === id);

        if (!message) {
            return;
        }

        Object.assign(message, patch);
        this.renderMessages();
    }

    setStatus(status: string): void {
        this.statusElement.textContent = status;
    }

    setStreaming(isStreaming: boolean): void {
        this.sendButtonElement.disabled = isStreaming;
        this.inputElement.disabled = isStreaming;
        this.setStatus(isStreaming ? "Thinking" : "Ready");
    }

    private submitMessage(): void {
        const text = this.inputElement.value.trim();

        if (!text) {
            return;
        }

        this.inputElement.value = "";
        this.submitHandler?.(text);
    }

    private renderMessages(): void {
        this.messagesElement.replaceChildren(
            ...this.messages.map((message) => {
                const item = document.createElement("article");
                item.className = `message message-${message.role}`;

                const role = document.createElement("strong");
                role.textContent = getRoleLabel(message.role);

                const content = document.createElement("p");
                content.textContent = message.content || " ";

                item.append(role, content);

                if (message.detail) {
                    const detail = document.createElement("pre");
                    detail.textContent = message.detail;
                    item.append(detail);
                }

                return item;
            }),
        );

        this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
    }
}

export function createChatView(): ChatView {
    return new ChatView(
        getElement<HTMLDivElement>("messages"),
        getElement<HTMLSpanElement>("status"),
        getElement<HTMLFormElement>("composer"),
        getElement<HTMLTextAreaElement>("message-input"),
        getElement<HTMLButtonElement>("send-button"),
    );
}

function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Missing element: ${id}`);
    }

    return element as T;
}

function getRoleLabel(role: MessageRole): string {
    if (role === "user") return "You";
    if (role === "assistant") return "Assistant";
    if (role === "tool") return "Tool";
    return "System";
}
