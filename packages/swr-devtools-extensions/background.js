// background.js
let panelPort;
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "content") {
    port.onMessage.addListener((message) => {
      console.log("sent message from content to panel", message);
      panelPort?.postMessage(message);
    });
  } else if (port.name === "panel") {
    panelPort = port;
    panelPort.onDisconnect.addListener(() => {
      panelPort = null;
    });
  }
});
