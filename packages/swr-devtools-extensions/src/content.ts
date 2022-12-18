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

let panelIsOpen = false;

let port_: Runtime.Port | null = null;

const debug = (...args: any[]) => {
  // console.log(...args);
};

const getPort = () => {
  if (port_ !== null) return port_;
  debug("reconnect content port");
  port_ = runtime.connect({ name: "content" });
  const onMessage = (message: any) => {
    debug("receive event", { message });
    if (message.type === "panelshow") {
      panelIsOpen = true;
      window.postMessage({ type: "panelshow" });
    } else if (message.type === "panelhide") {
      panelIsOpen = false;
      window.postMessage({ type: "panelhide" });
    }
  };
  // cannot get tabId here
  port_.onMessage.addListener(onMessage);
  port_.onDisconnect.addListener(() => {
    debug("disconnect content panel port");
    panelIsOpen = false;
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
      window.postMessage({ type: "load", payload: { panelIsOpen } });
      break;
    }
    case "updated_swr_cache":
    case "request_start":
    case "request_success":
    case "request_error":
    case "request_discarded": {
      if (panelIsOpen) {
        port.postMessage(e.data);
      }
      break;
    }
    default: {
      // noop
    }
  }
});
