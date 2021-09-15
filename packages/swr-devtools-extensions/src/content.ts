import { DevToolsMessage } from "swr-devtools";

export type ContentMessage =
  | {
      type: "initialized";
    }
  | {
      type: "updated_cache";
      payload: DevToolsMessage["payload"];
    };

// proxy messages from applications to a background script
const port = chrome.runtime.connect({ name: "content" });
port.postMessage({
  type: "initialized",
});

window.addEventListener("message", (e: MessageEvent<DevToolsMessage>) => {
  if (e.data?.type === "updated_swr_cache") {
    // console.log("received", e.data.cacheData);
    port.postMessage({
      type: "updated_cache",
      payload: e.data.payload,
    });
  }
});
