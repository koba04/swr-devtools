import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";
import { runtime } from "webextension-polyfill";

import type { ContentMessage } from "./content";

type EventListener = (...args: any[]) => void;

class EventEmitter {
  listeners: EventListener[] = [];
  subscribe(fn: EventListener) {
    this.listeners.push(fn);
    return () => {
      const index = this.listeners.indexOf(fn);
      this.listeners.splice(index, 1);
    };
  }
  emit(...args: any[]) {
    this.listeners.forEach((fn) => fn(...args));
  }
}

const eventEmitter = new EventEmitter();
const cache = new Map();
const rootEl = document.getElementById("app");

const port = runtime.connect({
  name: "panel",
});
port.onDisconnect.addListener(() => {
  cache.clear();
  mounted = false;
  ReactDOM.render(<SWRDevToolPanel cache={null} events={null} />, rootEl);
});

let mounted = false;
port.onMessage.addListener((message: ContentMessage) => {
  console.log("message on app.tsx", message);
  switch (message.type) {
    // loaded a new page
    case "load": {
      ReactDOM.render(<SWRDevToolPanel cache={null} events={null} />, rootEl);
      break;
    }

    // initialized SWRDevTools, start rendering a devtool panel
    case "initialized": {
      cache.clear();
      mounted = true;
      ReactDOM.render(
        <SWRDevToolPanel cache={cache} events={eventEmitter} />,
        rootEl
      );
      break;
    }

    case "updated_swr_cache": {
      const { key, value } = message.payload;
      // trigger re-rendering
      cache.set(key, value);

      // mount a devtool panel if it hasn't been mounted yet.
      if (mounted === false) {
        ReactDOM.render(
          <SWRDevToolPanel cache={cache} events={eventEmitter} />,
          rootEl
        );
        mounted = true;
      }
      break;
    }

    case "request_start":
    case "request_success":
    case "request_error":
    case "request_discarded": {
      // mount a devtool panel if it hasn't been mounted yet.
      if (mounted === false) {
        ReactDOM.render(
          <SWRDevToolPanel cache={cache} events={eventEmitter} />,
          rootEl
        );
        mounted = true;
      }
      eventEmitter.emit(message.type, message.payload);
      break;
    }

    default: {
      // noop
    }
  }
});
