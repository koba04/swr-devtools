// FIXME: Is this injection a recommended way?
const script = document.createElement("script");
script.src = chrome.runtime.getURL("runtime.js");
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);

window.addEventListener("message", (e) => {
  console.log("received", e);
  // send the data to the devtools_pages through a background script
  // https://developer.chrome.com/docs/extensions/mv3/devtools/#content-script-to-devtools
});
