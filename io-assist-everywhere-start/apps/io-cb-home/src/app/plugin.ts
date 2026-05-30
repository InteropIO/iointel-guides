import type { IOConnectBrowser } from "@interopio/browser";
import type { IOConnectBrowserPlatform } from "@interopio/browser-platform";

export const guidePluginStart: IOConnectBrowserPlatform.Plugins.PluginDefinition["start"] = async (io: IOConnectBrowser.API) => {
    console.log("Guide plugin started with IO Connect Browser API:", io);
};