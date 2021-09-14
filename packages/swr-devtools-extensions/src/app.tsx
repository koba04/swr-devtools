import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";

const cache = new Map();
const rootEl = document.getElementById("app");

// @ts-ignore
const port = chrome.runtime.connect({
  name: "panel",
});
// @ts-ignore
port.onMessage.addListener((request) => {
  if (request === "initializing...") {
    cache.clear();
    ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
  } else {
    cache.set(request.key, request.value);
    ReactDOM.render(<SWRDevToolPanel cache={cache} />, rootEl);
  }
});
port.onDisconnect.addListener(() => {
  cache.clear();
  ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
});

ReactDOM.render(<SWRDevToolPanel cache={cache} isReady={false} />, rootEl);
