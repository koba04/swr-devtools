import ReactDOM from "react-dom";
import { cache } from "swr";
import { SWRDevTools } from "swr-devtools";

const setup = () => {
  // @ts-ignore
  const port = chrome.runtime.connect({
    name: "panel",
  });

  // @ts-ignore
  port.onMessage.addListener((request) => {
    Object.entries(request).forEach(([key, value]: any) => {
      cache.set(key, value);
    });
    ReactDOM.render(
      <SWRDevTools cache={cache} />,
      document.getElementById("app")
    );
  });
};

setup();
// @ts-ignore
// chrome.devtools.network.onNavigated.addListener(setup);

const App = () => <SWRDevTools cache={cache} />;
ReactDOM.render(<App />, document.getElementById("app"));
