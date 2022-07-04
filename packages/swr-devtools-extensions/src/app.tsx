import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";
import { runtime, devtools, Runtime } from "webextension-polyfill";

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
const cacheMap = new Map();
const rootEl = document.getElementById("app");

const port = runtime.connect({
  name: "panel:" + devtools.inspectedWindow.tabId,
});

/*
port.onDisconnect.addListener(() => {
  cache.clear();
  mounted = false;
  ReactDOM.render(<SWRDevToolPanel cache={null} events={null} />, rootEl);
});
*/

let mounted = false;
port.onMessage.addListener(
  // sender is undefined
  (message: ContentMessage, { sender }: Runtime.Port) => {
    const tabId = message.tabId; // sender?.tab?.id;
    const cache = cacheMap.get(tabId) || new Map();
    /*
    console.log("received in app.tsx", {
      message,
      tabId,
      sender,
      cache,
    });
    */

    if (!cacheMap.has(tabId)) {
      cacheMap.set(tabId, cache);
    }
    switch (message.type) {
      // loaded a new page
      case "load": {
        ReactDOM.render(
          <SWRDevToolPanel cache={null} events={null} key={tabId} />,
          rootEl
        );
        mounted = false;
        break;
      }

      // initialized SWRDevTools, start rendering a devtool panel
      case "initialized": {
        cache.clear();
        mounted = true;
        ReactDOM.render(
          <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />,
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
            <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />,
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
            <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />,
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
  }
);
