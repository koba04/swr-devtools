import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";

import type { ContentMessage } from "./content";

const cache = new Map();
const rootEl = document.getElementById("app");

// @ts-ignore
const port = chrome.runtime.connect({
  name: "panel",
});
port.onDisconnect.addListener(() => {
  cache.clear();
  mounted = false;
  ReactDOM.render(<SWRDevToolPanel cache={null} />, rootEl);
});

let mounted = false;
// @ts-ignore
port.onMessage.addListener((message: ContentMessage) => {
  switch (message.type) {
    // loaded a new page
    case "load": {
      ReactDOM.render(<SWRDevToolPanel cache={null} />, rootEl);
      break;
    }

    // initialized SWRDevTools, start rendering a devtool panel
    case "initialized": {
      cache.clear();
      mounted = true;
      ReactDOM.render(<SWRDevToolPanel cache={cache} />, rootEl);
      break;
    }

    case "updated_swr_cache": {
      const { key, value } = message.payload;
      // trigger re-rendering
      cache.set(key, value);

      // mount a devtool panel if it hasn't been mounted yet.
      if (mounted === false) {
        ReactDOM.render(<SWRDevToolPanel cache={cache} />, rootEl);
        mounted = true;
      }
      break;
    }

    default: {
      // noop
    }
  }
});
