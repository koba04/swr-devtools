// background.js
let panelPort: chrome.runtime.Port | null = null;

const queuedMessages: any[] = [];
const flushQueuedMessages = () => {
  if (panelPort === null) {
    return;
  }
  for (const queuedMessage of queuedMessages) {
    panelPort.postMessage(queuedMessage);
  }
  queuedMessages.length = 0;
};
const enqueueMessage = (message: any) => {
  queuedMessages.push(message);
};

chrome.runtime.onConnect.addListener((port) => {
  // A port between a content page
  if (port.name === "content") {
    port.onMessage.addListener((message) => {
      console.log("sent message from content to panel", message);
      if (panelPort === null) {
        enqueueMessage(message);
      } else {
        flushQueuedMessages();
        panelPort.postMessage(message);
      }
    });
    // A port between the SWR panel in devtools
  } else if (port.name === "panel") {
    panelPort = port;
    flushQueuedMessages();
    panelPort.onDisconnect.addListener(() => {
      panelPort = null;
    });
  }
});
