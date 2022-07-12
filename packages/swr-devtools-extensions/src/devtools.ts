import { devtools, scripting } from "webextension-polyfill";

devtools.panels.create("SWR", "", "panel.html").then(() => {
  console.log("The DevTools panel has been created");
});

scripting
  .executeScript({
    target: {
      tabId: devtools.inspectedWindow.tabId,
      allFrames: true,
    },
    files: ["web-accessible.js"],
  })
  .then((r) => console.log("executeScript has been success", r))
  .catch((e) => console.log("executeScript has been failed", e));
