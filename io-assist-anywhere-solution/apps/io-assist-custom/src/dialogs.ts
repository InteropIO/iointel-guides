import type { IoAiWeb } from "@interopio/ai-web";
import type { ElicitationProperty } from "./types";

export function showConfirmDialog(params: {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
}): Promise<boolean> {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        const dialog = document.createElement("div");
        dialog.className = "dialog";

        const title = document.createElement("h2");
        title.textContent = params.title;

        const message = document.createElement("p");
        message.textContent = params.message;

        const actions = document.createElement("div");
        actions.className = "dialog-actions";

        const cancelButton = createButton(params.cancelText, "button");
        const confirmButton = createButton(params.confirmText, "button", "primary");

        actions.append(cancelButton, confirmButton);
        dialog.append(title, message, actions);
        overlay.append(dialog);
        document.body.append(overlay);

        const close = (accepted: boolean): void => {
            overlay.remove();
            resolve(accepted);
        };

        cancelButton.addEventListener("click", () => close(false));
        confirmButton.addEventListener("click", () => close(true));
    });
}

export function showElicitationDialog(
    serverName: string,
    request: IoAiWeb.ElicitationRequestParams,
): Promise<IoAiWeb.ElicitationResponse> {
    return new Promise((resolve) => {
        const overlay = createOverlay();
        const form = document.createElement("form");
        form.className = "dialog";

        const title = document.createElement("h2");
        title.textContent = "Additional information";

        const message = document.createElement("p");
        message.textContent = `${serverName}: ${request.message}`;

        const fields = document.createElement("div");
        fields.className = "dialog-fields";

        const inputs = new Map<string, HTMLInputElement | HTMLSelectElement>();
        const properties = request.requestedSchema.properties ?? {};

        for (const [name, schema] of Object.entries(properties)) {
            const field = createElicitationField(name, schema);
            fields.append(field.wrapper);
            inputs.set(name, field.input);
        }

        const actions = document.createElement("div");
        actions.className = "dialog-actions";

        const declineButton = createButton("Decline", "button");
        const cancelButton = createButton("Cancel", "button");
        const acceptButton = createButton("Accept", "submit", "primary");

        actions.append(declineButton, cancelButton, acceptButton);
        form.append(title, message, fields, actions);
        overlay.append(form);
        document.body.append(overlay);

        const close = (response: IoAiWeb.ElicitationResponse): void => {
            overlay.remove();
            resolve(response);
        };

        declineButton.addEventListener("click", () => close({ action: "decline" }));
        cancelButton.addEventListener("click", () => close({ action: "cancel" }));
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const content: Record<string, unknown> = {};

            for (const [name, input] of inputs.entries()) {
                if (input instanceof HTMLInputElement && input.type === "checkbox") {
                    content[name] = input.checked;
                } else if (input instanceof HTMLInputElement && input.type === "number") {
                    content[name] = input.value === "" ? undefined : Number(input.value);
                } else {
                    content[name] = input.value;
                }
            }

            close({ action: "accept", content });
        });
    });
}

function createElicitationField(name: string, schema: ElicitationProperty): {
    wrapper: HTMLLabelElement;
    input: HTMLInputElement | HTMLSelectElement;
} {
    const wrapper = document.createElement("label");
    const label = document.createElement("span");
    label.textContent = schema.title ?? name;

    let input: HTMLInputElement | HTMLSelectElement;

    if (schema.enum?.length) {
        const select = document.createElement("select");

        schema.enum.forEach((value, index) => {
            const option = document.createElement("option");
            option.value = String(value);
            option.textContent = schema.enumNames?.[index] ?? String(value);
            select.append(option);
        });

        input = select;
    } else {
        const field = document.createElement("input");
        field.type = schema.type === "boolean" ? "checkbox" : schema.type === "number" || schema.type === "integer" ? "number" : "text";

        if (schema.type === "boolean" && "default" in schema) {
            field.checked = Boolean(schema.default);
        }

        input = field;
    }

    if (schema.description) {
        input.setAttribute("aria-label", schema.description);
    }

    wrapper.append(label, input);
    return { wrapper, input };
}

function createOverlay(): HTMLDivElement {
    const overlay = document.createElement("div");
    overlay.className = "dialog-overlay";
    return overlay;
}

function createButton(text: string, type: "button" | "submit", variant?: "primary"): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = type;
    button.textContent = text;

    if (variant) {
        button.className = variant;
    }

    return button;
}
