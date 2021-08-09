// FIXME: Is this injection a recommended way?
const script = document.createElement("script");
script.src = chrome.runtime.getURL("runtime.js");
document.documentElement.appendChild(script);
script.parentNode?.removeChild(script);

// proxy messages from applications to a background script
const port = chrome.runtime.connect({ name: "content" });
window.addEventListener("message", (e) => {
  if (e.data?.cacheData) {
    // console.log("received", e.data.cacheData);
    port.postMessage(e.data.cacheData);
  }
});
