import { DevToolsMessage } from "swr-devtools";
import { Runtime, devtools, runtime } from "webextension-polyfill";

const injectDevToolsHook = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.runtime.getURL("web-accessible.js"));
  document.documentElement.appendChild(script);
  script.parentNode?.removeChild(script);
};
injectDevToolsHook();

export type ContentMessage =
  | {
      type: "load";
      tabId: number;
    }
  | {
      type: "initialized";
      tabId: number;
    }
  | {
      type: "updated_swr_cache";
      payload: any;
      tabId: number;
    }
  | {
      type: "load";
      tabId: number;
    }
  | {
      type: "request_start";
      payload: any;
      tabId: number;
    }
  | {
      type: "request_success";
      payload: any;
      tabId: number;
    }
  | {
      type: "request_error";
      payload: any;
      tabId: number;
    }
  | {
      type: "request_discarded";
      payload: any;
      tabId: number;
    };

let isDisplayedPanel = false;
// TODO: how to use the flag?
let isPanelShown = false;

let port_: Runtime.Port | null = null;

// TODO: リロードされたら必ず false
// devtools 表示されたら true

console.log({ isPanelShown });

const getPort = () => {
  if (port_ !== null) return port_;
  console.log("reconnect content port");
  port_ = runtime.connect({ name: "content" });
  const onMessage = (message: any) => {
    console.log("receive event", { message });
    if (message.type === "show_panel") {
      isPanelShown = true;
      isDisplayedPanel = true;
      window.postMessage({ type: "show_panel" });
    } else if (message.type === "hide_panel") {
      isPanelShown = false;
      isDisplayedPanel = false;
      window.postMessage({ type: "hide_panel" });
      // a panel has been displayed, so we sent queued messages
    } else if (message.type === "displayed_panel") {
      // isDisplayedPanel = true;
      window.postMessage({ type: "displayed_panel" });
    } else if (message.type === "disconnected_panel") {
      isDisplayedPanel = false;
      window.postMessage({ type: "disconnected_panel" });
    }
  };
  // cannot get tabId here
  port_.onMessage.addListener(onMessage);
  port_.onDisconnect.addListener(() => {
    console.log("disconnect content panel port");
    isDisplayedPanel = false;
    port_?.onMessage.removeListener(onMessage);
    port_ = null;
  });

  return port_;
};

// wait for loading applications

setTimeout(() => {
  window.postMessage({ type: "load", payload: isPanelShown });
}, 1000);

// proxy messages from applications to a background script

// A new page has been loaded.
// this event is sent with any pages that don't have SWRDevTools
getPort().postMessage({
  type: "load",
});

window.addEventListener("message", (e: MessageEvent<DevToolsMessage>) => {
  const port = getPort();
  switch (e.data?.type) {
    case "initialized": {
      port.postMessage(e.data);
      break;
    }
    case "updated_swr_cache":
    case "request_start":
    case "request_success":
    case "request_error":
    case "request_discarded": {
      if (isDisplayedPanel) {
        port.postMessage(e.data);
      }
      break;
    }
    default: {
      // noop
    }
  }
});
