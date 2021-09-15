import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";

import type { ContentMessage } from "./content";

const cache = new Map();
const rootEl = document.getElementById("app");

// @ts-ignore
const port = chrome.runtime.connect({
  name: "panel",
});
// @ts-ignore
port.onMessage.addListener((message: ContentMessage) => {
  if (message.type === "initialized") {
    cache.clear();
    ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
  } else if (message.type === "updated_cache") {
    const { key, value } = message.payload;
    cache.set(key, value);
    ReactDOM.render(<SWRDevToolPanel cache={cache} />, rootEl);
  }
});
port.onDisconnect.addListener(() => {
  cache.clear();
  ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
});

ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
