import ReactDOM from "react-dom";
import { SWRDevTools } from "swr-devtools";
import { createDevToolsSWRCache } from "swr-devtools/lib/cache";

const cache = createDevToolsSWRCache(new Map() as any);

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
  cache.set(request.key, request.value);
  render();
});

render();
