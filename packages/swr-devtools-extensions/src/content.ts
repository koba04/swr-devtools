import { DevToolsMessage } from "swr-devtools";
import { runtime } from "webextension-polyfill";

export type ContentMessage =
  | {
      type: "load";
    }
  | {
      type: "initialized";
    }
  | {
      type: "updated_swr_cache";
      payload: any;
    }
  | {
      type: "load";
    };

// queued messages until a panel is displayed
const queuedMessages: any[] = [];
const enqueueMessage = (message: any) => {
  queuedMessages.push(message);
};

let isDisplayedPanel = false;

// proxy messages from applications to a background script
const port = runtime.connect({ name: "content" });
port.onMessage.addListener((message: any) => {
  console.log("received from background -> content", message);
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
    case "updated_swr_cache": {
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
