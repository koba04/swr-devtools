import { DevToolsMessage } from "swr-devtools";
import { Runtime, runtime } from "webextension-polyfill";

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

let isPanelShown = false;

let port_: Runtime.Port | null = null;

const getPort = () => {
  if (port_ !== null) return port_;
  console.log("reconnect content port");
  port_ = runtime.connect({ name: "content" });
  const onMessage = (message: any) => {
    console.log("receive event", { message });
    if (message.type === "show_panel") {
      isPanelShown = true;
      window.postMessage({ type: "show_panel" });
    } else if (message.type === "hide_panel") {
      isPanelShown = false;
      window.postMessage({ type: "hide_panel" });
    }
  };
  // cannot get tabId here
  port_.onMessage.addListener(onMessage);
  port_.onDisconnect.addListener(() => {
    console.log("disconnect content panel port");
    isPanelShown = false;
    port_?.onMessage.removeListener(onMessage);
    port_ = null;
  });

  return port_;
};

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
      // sync the status of displayed panel
      window.postMessage({ type: "load", payload: isPanelShown });
      break;
    }
    case "updated_swr_cache":
    case "request_start":
    case "request_success":
    case "request_error":
    case "request_discarded": {
      if (isPanelShown) {
        port.postMessage(e.data);
      }
      break;
    }
    default: {
      // noop
    }
  }
});
