# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

![A screenshot of SWR Devtools (light theme)](../../imgs/light.png)

![A screenshot of SWR Devtools (dark theme)](../../imgs/dark.png)

### Install

```shell
# This package hasn't been published yet.
npm install swr-devtools
# Install peerDependencies
npm install react swr
```

**This only supports SWR v1 or later versions.**

## How to use

### Wrap your application in the SWRDevTools component

```jsx
import ReactDOM from "react-dom";
// This package hasn't been published yet.
import { SWRDevTools } from "swr-devtools";

ReactDOM.render(
  <SWRDevTools>
    <MainApp />
  </SWRDevTools>,
  document.getElementById("app")
);
```

### Install SWRDevTools from Chrome Web Store

https://chrome.google.com/webstore/detail/swr-devtools/liidbicegefhheghhjbomajjaehnjned

## LICENSE

[MIT](LICENSE.md)
