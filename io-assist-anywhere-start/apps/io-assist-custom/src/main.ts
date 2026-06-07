import { createChatView } from "./chat-view";
import "./styles.css";

const view = createChatView();

view.addMessage({
    role: "system",
    content: "Custom assistant shell ready. Add the AI Web integration in Chapter 11.",
});
view.setStatus("Ready");

view.onSubmit((text) => {
    view.addMessage({ role: "user", content: text });
    view.addMessage({
        role: "system",
        content: "The custom assistant is not connected yet. Continue Chapter 11 to add AI Web.",
    });
});
