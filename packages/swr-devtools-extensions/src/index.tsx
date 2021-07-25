import ReactDOM from "react-dom";
import { cache } from "swr";
import { SWRDevTools } from "swr-devtools";

const App = () => <SWRDevTools cache={cache} />;
ReactDOM.render(<App />, document.getElementById("app"));
