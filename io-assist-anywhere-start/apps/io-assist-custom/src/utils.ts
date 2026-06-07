export function getText(content: unknown): string {
    if (!content) {
        return "";
    }

    if (typeof content === "string") {
        return content;
    }

    if (typeof content === "object" && "text" in content && typeof content.text === "string") {
        return content.text;
    }

    return stringify(content);
}

export function parseToolResult(content: unknown): unknown {
    if (typeof content !== "string") {
        return content;
    }

    return parseJSON(content, content);
}

export function parseJSON(value: string, fallback: unknown = {}): unknown {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

export function stringify(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }

    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}
