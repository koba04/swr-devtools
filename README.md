# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

![A screenshot of SWR Devtools (light theme)](./imgs/light.png)

![A screenshot of SWR Devtools (dark theme)](./imgs/dark.png)

**This only supports SWR v1 or later versions.**

## How to Use

### 1.Install this Chrome extension

**THIS HAS NOT BEEN PUBLISHED YET**

### 2.Wrap your application in the SWRDevTools component

```js
import ReactDOM from "react-dom";
import { SWRDevTools } from "swr-devtools";

ReactDOM.render(
  <SWRDevTools>
    <App />
  </SWRDevTools>,
  document.getElementById("app")
);
```

## LICENSE

[MIT](LICENSE.md)
