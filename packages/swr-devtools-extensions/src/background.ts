import { Runtime, runtime } from "webextension-polyfill";
import type { ContentMessage } from "./content";

const contentPortMap = new Map();
const panelPortMap = new Map();

let panelIsOpen = false;

const debug = (...args: any[]) => {
  // console.log(...args);
};

runtime.onConnect.addListener((port: Runtime.Port) => {
  const tabId = port.sender?.tab?.id || +port.name.replace("panel:", "");
  console.log("on connect", { name: port.name, tabId });

  // A port between a content page
  if (port.name === "content") {
    contentPortMap.set(tabId, port);
    port.postMessage({
      type: panelIsOpen ? "panelshow" : "panelhide",
    });
    port.onDisconnect.addListener(() => {
      console.log("disconnected content port => ", tabId);
      contentPortMap.delete(tabId);
    });
    port.onMessage.addListener(
      (message: ContentMessage, { sender }: Runtime.Port) => {
        // this might not be necessary
        const data = {
          ...message,
          tabId,
        };

        const panelPort = panelPortMap.get(tabId);
        panelPort?.postMessage(data);

        debug("sent message from content to panel", data, {
          sender,
          tabId,
          panelPortMap,
          panelPort,
        });
      },
    );
    // A port between the SWR panel in devtools
  } else if (port.name.startsWith("panel")) {
    panelPortMap.set(tabId, port);
    port.onDisconnect.addListener(() => {
      console.log("disconnected panel port => ", tabId);
      panelPortMap.delete(tabId);
    });
    port.onMessage.addListener((message) => {
      if (message.type === "panelshow") {
        panelIsOpen = true;
      } else if (message.type === "panelhide") {
        panelIsOpen = false;
      }

      const contentPort = contentPortMap.get(tabId);
      contentPort?.postMessage(message);

      debug("sent message from panel to content", message, contentPort);
    });
  }
});
