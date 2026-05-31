// @ts-ignore
import { IOConnectHome, type IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "./helpers";
// @ts-ignore
import "@interopio/workspaces-ui-react/dist/styles/workspaces.css";
// @ts-ignore
import "@interopio/home-ui-react/index.css";

const ioConnectHomeConfig: IOConnectHomeConfig = {
    getIOConnectConfig: getIOConfig,
    setupFlow: { enabled: false },
    settings: { isBeforeunloadDialogEnabled: false }
};

export function App() {
    return <IOConnectHome config={ioConnectHomeConfig} />;
}

export default App;
