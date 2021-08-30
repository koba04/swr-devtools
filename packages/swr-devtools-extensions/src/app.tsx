import ReactDOM from "react-dom";
import { SWRDevToolPanel } from "swr-devtools-panel";

const cache = new Map();

const render = () => {
  ReactDOM.render(
    <SWRDevToolPanel cache={cache} />,
    document.getElementById("app")
  );
};

// @ts-ignore
const port = chrome.runtime.connect({
  name: "panel",
});
// @ts-ignore
port.onMessage.addListener((request) => {
  cache.set(request.key, request.value);
  render();
});

render();
