import { devtools, runtime } from "webextension-polyfill";

devtools.panels.create("SWR", "", "panel.html").then((panel) => {
  const port = runtime.connect({
    name: "panel:" + devtools.inspectedWindow.tabId,
  });
  panel.onHidden.addListener(() => {
    // console.log("hide panel");
    port.postMessage({ type: "panelhide" });
  });
  panel.onShown.addListener(() => {
    // console.log("show panel");
    port.postMessage({ type: "panelshow" });
  });
  console.log("The DevTools panel has been created");
});
