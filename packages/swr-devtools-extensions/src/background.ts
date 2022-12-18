import { runtime, Runtime } from "webextension-polyfill";
import type { ContentMessage } from "./content";

const contentPortMap = new Map();
const panelPortMap = new Map();

let panelIsOpen = false;

runtime.onConnect.addListener((port: Runtime.Port) => {
  const tabId = port.sender?.tab?.id || +port.name.replace("panel:", "");
  console.log("on connect", { name: port.name, tabId });

  // A port between a content page
  if (port.name === "content") {
    contentPortMap.set(tabId, port);
    if (panelPortMap.has(tabId)) {
      port.postMessage({
        type: panelIsOpen ? "panelshow" : "panelhide",
      });
    }
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
        /*
        console.log("sent message from content to panel", data, {
          sender,
          tabId,
          panelPortMap,
          panelPort,
        });
        */

        const panelPort = panelPortMap.get(tabId);
        panelPort?.postMessage(data);
      }
    );
    // A port between the SWR panel in devtools
  } else if (port.name.startsWith("panel")) {
    panelPortMap.set(tabId, port);
    port.onDisconnect.addListener(() => {
      console.log("disconnected panel port => ", tabId);
      panelPortMap.delete(tabId);
    });
    port.onMessage.addListener((message) => {
      const contentPort = contentPortMap.get(tabId);
      console.log("sent message from panel to content", message, contentPort);
      if (message.type === "panelshow") {
        panelIsOpen = true;
      } else if (message.type === "panelhide") {
        panelIsOpen = false;
      }
      contentPort?.postMessage(message);
    });
  }
});
