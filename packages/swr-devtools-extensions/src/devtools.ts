import { devtools } from "webextension-polyfill";

devtools.panels.create("SWR", "", "panel.html").then(() => {
  console.log("The DevTools panel has been created");
});
