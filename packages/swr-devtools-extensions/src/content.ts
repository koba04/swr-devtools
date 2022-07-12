import { DevToolsMessage } from "swr-devtools";
import { Runtime, runtime } from "webextension-polyfill";

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

let port_: Runtime.Port | null = null;

const getPort = () => {
  if (port_ !== null) return port_;
  port_ = runtime.connect({ name: "content" });
  const onMessage = (message: any) => {
    // a panel has been displayed, so we sent queued messages
    if (message.type === "displayed_panel") {
      queuedMessages.forEach((m) => {
        port_?.postMessage(m);
      });
      isDisplayedPanel = true;
    }
  };
  // cannot get tabId here
  port_.onMessage.addListener(onMessage);
  port_.onDisconnect.addListener(() => {
    port_?.onMessage.removeListener(onMessage);
    port_ = null;
  });

  return port_;
};

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
