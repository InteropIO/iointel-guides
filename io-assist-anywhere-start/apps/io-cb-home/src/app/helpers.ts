// @ts-ignore
import { type IOConnectHomeConfig } from "@interopio/home-ui-react";
import IOBrowserPlatform, { type IOConnectBrowserPlatform } from "@interopio/browser-platform";
import type { IOConnectBrowser } from "@interopio/browser";
import IOModals from "@interopio/modals-api";
import IOWorkspaces from "@interopio/workspaces-api";
import config from "../config.json";
import { guidePluginStart } from "./plugin";

const getPluginsDefinitions = (): IOConnectBrowserPlatform.Plugins.Config => {
    return {
        definitions: [{
            name: "guide-plugin",
            start: guidePluginStart,
            critical: true
        }]
    };
};

export const getIOConfig: IOConnectHomeConfig["getIOConnectConfig"] = () => {

    const licenseKey = (import.meta as any).env.VITE_LICENSE_KEY;

    return {
        browserPlatform: {
            factory: async (config: any) => {
                const platformInit = await IOBrowserPlatform(config);

                (window as any).io = platformInit.io;
                (window as any).platform = platformInit.platform;

                console.log("IO Connect Browser Platform initialized");

                return platformInit;
            },
            config: {
                serviceWorker: { url: "/service-worker.js" },
                workspaces: {
                    src: "/",
                    isFrame: true
                },
                applications: {
                    local: config.apps
                },
                layouts: {
                    mode: "session",
                    local: config.layouts as IOConnectBrowser.Layouts.Layout[]
                },
                channels: {
                    definitions: config.channels
                },
                gateway: {
                    logging: {
                        level: "warn"
                    }
                },
                browser: {
                    libraries: [IOWorkspaces, IOModals],
                    modals: {
                        dialogs: {
                            enabled: true
                        },
                        alerts: {
                            enabled: true
                        }
                    },
                    systemLogger: {
                        level: "info"
                    },
                    intentResolver: {
                        enable: true
                    }
                },
                modals: {
                    sources: {
                        bundle: `${window.location.origin}/modals/io-browser-modals-ui.es.js`,
                        styles: [`${window.location.origin}/modals/styles.css`],
                        fonts: [`${window.location.origin}/modals/fonts.css`]
                    }
                },
                intentResolver: {
                    sources: {
                        bundle: `${window.location.origin}/intent-resolver/io-browser-intent-resolver-ui.es.js`,
                        styles: [`${window.location.origin}/intent-resolver/styles.css`],
                        fonts: [`${window.location.origin}/intent-resolver/fonts.css`]
                    }
                },
                widget: {
                    sources: {
                        bundle: `${window.location.origin}/widget/io-browser-widget.es.js`,
                        styles: [`${window.location.origin}/widget/styles.css`],
                        fonts: [`${window.location.origin}/widget/fonts.css`]
                    }
                },
                plugins: getPluginsDefinitions(),
                licenseKey
            }
        }
    };
};
