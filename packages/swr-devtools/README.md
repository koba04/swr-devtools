# swr-devtools

[![npm version](https://badge.fury.io/js/swr-devtools.svg)](https://badge.fury.io/js/swr-devtools)

![A screenshot of SWR Devtools (light theme)](https://raw.githubusercontent.com/koba04/swr-devtools/main/imgs/light.png)

![A screenshot of SWR Devtools (dark theme)](https://raw.githubusercontent.com/koba04/swr-devtools/main/imgs/dark.png)

### Install

```shell
npm install swr-devtools
# Install peerDependencies
npm install react swr
```

**This only supports SWR v1 or later versions.**

## How to use

### Wrap your application in the SWRDevTools component

```jsx
import ReactDOM from "react-dom";
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
