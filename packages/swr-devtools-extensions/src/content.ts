// proxy messages from applications to a background script
const port = chrome.runtime.connect({ name: "content" });
port.postMessage("initializing...");

window.addEventListener("message", (e) => {
  if (e.data?.__SWR_DEVTOOLS__?.cacheData) {
    // console.log("received", e.data.cacheData);
    port.postMessage(e.data.__SWR_DEVTOOLS__.cacheData);
  }
});
