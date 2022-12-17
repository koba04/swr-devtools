import { devtools, runtime } from "webextension-polyfill";

const port = runtime.connect({
  name: "panel:" + devtools.inspectedWindow.tabId,
});

devtools.panels.create("SWR", "", "panel.html").then((panel) => {
  panel.onHidden.addListener(() => {
    console.log("hide panel");
    port.postMessage({ type: "hide_panel" });
  });
  panel.onShown.addListener(() => {
    console.log("show panel");
    port.postMessage({ type: "show_panel" });
  });
  console.log("The DevTools panel has been created");
});
