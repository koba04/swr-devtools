// background.js
let panelPort: chrome.runtime.Port | null;
chrome.runtime.onConnect.addListener((port) => {
  // A port between a content page
  if (port.name === "content") {
    port.onMessage.addListener((message) => {
      console.log("sent message from content to panel", message);
      panelPort?.postMessage(message);
    });
    // A port between the SWR panel in devtools
  } else if (port.name === "panel") {
    panelPort = port;
    panelPort.onDisconnect.addListener(() => {
      panelPort = null;
    });
  }
});
