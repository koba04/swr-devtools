import { runtime, Runtime } from "webextension-polyfill";
import type { ContentMessage } from "./content";

const contentPortMap = new Map();
const panelPortMap = new Map();

// queued messages until a panel is connected
const queuedContentMessages: any[] = [];

let showPanel = false;

runtime.onConnect.addListener((port: Runtime.Port) => {
  const tabId = port.sender?.tab?.id || +port.name.replace("panel:", "");
  console.log("on connect", { name: port.name, tabId });

  // A port between a content page
  if (port.name === "content") {
    contentPortMap.set(tabId, port);
    if (panelPortMap.has(tabId)) {
      // notify that a panel is connected
      /*
      port.postMessage({
        type: "displayed_panel",
      });
      */

      port.postMessage({
        type: showPanel ? "show_panel" : "hide_panel",
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

        const panelPort = panelPortMap.get(tabId);
        /*
        console.log("sent message from content to panel", data, {
          sender,
          tabId,
          panelPortMap,
          panelPort,
        });
        */
        if (panelPort) {
          panelPort.postMessage(data);
        } else {
          // not ready for sending messages
          queuedContentMessages.push(data);
        }
      }
    );
    // A port between the SWR panel in devtools
  } else if (port.name.startsWith("panel")) {
    panelPortMap.set(tabId, port);
    // console.log("panelport", { tabId, panelPortMap, contentPortMap });
    // if (contentPort) {
    // notify that a panel is connected
    /*
      contentPort.postMessage({
        type: "displayed_panel",
      });
      */
    // }
    // flush queued messages
    if (queuedContentMessages.length > 0) {
      queuedContentMessages.forEach((m) => port?.postMessage(m));
      queuedContentMessages.length = 0;
    }
    port.onDisconnect.addListener(() => {
      console.log("disconnected panel port => ", tabId);
      panelPortMap.delete(tabId);
    });
    port.onMessage.addListener((message) => {
      const contentPort = contentPortMap.get(tabId);
      console.log("sent message from panel to content", message, contentPort);
      if (message.type === "show_panel") {
        showPanel = true;
      } else if (message.type === "hide_panel") {
        showPanel = false;
      }
      contentPort?.postMessage(message);
    });
  }
});
