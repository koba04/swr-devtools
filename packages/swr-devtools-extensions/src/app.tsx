import ReactDOM from "react-dom";
import { cache } from "swr";
import { SWRDevTools } from "swr-devtools";

const render = () => {
  ReactDOM.render(
    <SWRDevTools cache={cache} />,
    document.getElementById("app")
  );
};

// @ts-ignore
const port = chrome.runtime.connect({
  name: "panel",
});
// @ts-ignore
port.onMessage.addListener((request) => {
  Object.entries(request).forEach(([key, value]: any) => {
    cache.set(key, value);
  });
  render();
});

render();
