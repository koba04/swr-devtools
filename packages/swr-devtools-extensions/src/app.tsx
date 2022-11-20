import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { SWRDevToolPanel } from "swr-devtools-panel";
import { deserializePayload } from "swr-devtools";
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
const rootEl = document.getElementById("app")!;

const port = runtime.connect({
  name: "panel:" + devtools.inspectedWindow.tabId,
});

const root = createRoot(rootEl);
const render = (el: ReactElement) => root.render(el);

/*
port.onDisconnect.addListener(() => {
  cache.clear();
  mounted = false;
  render(<SWRDevToolPanel cache={null} events={null} />);
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
        render(<SWRDevToolPanel cache={null} events={null} key={tabId} />);
        mounted = false;
        break;
      }

      // initialized SWRDevTools, start rendering a devtool panel
      case "initialized": {
        cache.clear();
        mounted = true;
        render(
          <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />
        );
        break;
      }

      case "updated_swr_cache": {
        const { key, value } = deserializePayload(message.payload) as any;
        // trigger re-rendering
        cache.set(key, value);

        // mount a devtool panel if it hasn't been mounted yet.
        if (mounted === false) {
          render(
            <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />
          );
          mounted = true;
        }
        break;
      }

      case "request_start":
      case "request_success":
      case "request_error":
      case "request_discarded": {
        const type = message.type;
        const payload = deserializePayload(message.payload);
        // mount a devtool panel if it hasn't been mounted yet.
        if (mounted === false) {
          render(
            <SWRDevToolPanel cache={cache} events={eventEmitter} key={tabId} />
          );
          mounted = true;
        }
        eventEmitter.emit(type, payload);
        break;
      }

      default: {
        // noop
      }
    }
  }
);
