import { DevToolsMessage } from "swr-devtools";
import { runtime } from "webextension-polyfill";

const injectDevToolsHook = () => {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", chrome.runtime.getURL("web-accessible.js"));
  document.documentElement.appendChild(script);
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

// queued messages until a panel is displayed
const queuedMessages: any[] = [];
const enqueueMessage = (message: any) => {
  queuedMessages.push(message);
};

let isDisplayedPanel = false;

// proxy messages from applications to a background script
const port = runtime.connect({ name: "content" });
// cannot get tabId here
port.onMessage.addListener((message: any) => {
  // a panel has been displayed, so we sent queued messages
  if (message.type === "displayed_panel") {
    queuedMessages.forEach((m) => {
      port.postMessage(m);
    });
    isDisplayedPanel = true;
  }
});

// A new page has been loaded.
// this event is sent with any pages that don't have SWRDevTools
port.postMessage({
  type: "load",
});

window.addEventListener("message", (e: MessageEvent<DevToolsMessage>) => {
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
      } else {
        // enqueue a message if a panel hasn't been displayed
        enqueueMessage(e.data);
      }
      break;
    }
    default: {
      // noop
    }
  }
});
