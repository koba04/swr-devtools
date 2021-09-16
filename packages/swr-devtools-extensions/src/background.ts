import type { ContentMessage } from "./content";
// background.js
let panelPort: chrome.runtime.Port | null = null;
let contentPort: chrome.runtime.Port | null = null;

// queued messages until a panel is connected
const queuedContentMessages: any[] = [];

chrome.runtime.onConnect.addListener((port) => {
  console.log("on connect", port.name);
  // A port between a content page
  if (port.name === "content") {
    contentPort = port;
    if (panelPort !== null) {
      // notify that a panel is connected
      contentPort.postMessage({
        type: "displayed_panel",
      });
    }
    contentPort.onDisconnect.addListener(() => {
      contentPort = null;
    });
    contentPort.onMessage.addListener((message: ContentMessage) => {
      console.log("sent message from content to panel", message);
      if (panelPort !== null) {
        panelPort.postMessage(message);
      } else {
        // not ready for sending messages
        queuedContentMessages.push(message);
      }
    });
    // A port between the SWR panel in devtools
  } else if (port.name === "panel") {
    panelPort = port;
    if (contentPort !== null) {
      // notify that a panel is connected
      contentPort.postMessage({
        type: "displayed_panel",
      });
    }
    // flush queued messages
    if (queuedContentMessages.length > 0) {
      queuedContentMessages.forEach((m) => panelPort?.postMessage(m));
      queuedContentMessages.length = 0;
    }
    panelPort.onDisconnect.addListener(() => {
      panelPort = null;
    });
    panelPort.onMessage.addListener((message) => {
      console.log("sent message from panel to content", message);
      if (contentPort !== null) {
        contentPort.postMessage(message);
      }
    });
  }
});
