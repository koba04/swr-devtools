# swr-devtools

A DevTools for SWR

[![](https://github.com/koba04/swr-devtools/workflows/lint/badge.svg)](https://github.com/koba04/swr-devtools/actions?workflow=lint)

![A screenshot of SWR Devtools (light theme)](./imgs/light.png)

![A screenshot of SWR Devtools (dark theme)](./imgs/dark.png)

**This only supports SWR v1 or later versions.**

## How to use

### Install the SWRDevTools extension

- Chrome
    - https://chrome.google.com/webstore/detail/swr-devtools/liidbicegefhheghhjbomajjaehnjned
- Firefox
    - https://addons.mozilla.org/en-US/firefox/addon/swr-devtools/

### (SWR v1) Wrap your application in the SWRDevTools component

<details>
<summary>This instruction is only required with SWR v1</summary>

**⚠️ If you use SWR v2 or later versions, you don't need to install `swr-devtools` and wrap your application. SWR Devtools does it for you.**

```shell
npm install swr-devtools
# Install peerDependencies
npm install react swr
```

```jsx
import { createRoot } from "react-dom/client";
import { SWRDevTools } from "swr-devtools";

createRoot(document.getElementById("app")).render(
  <SWRDevTools>
    <MainApp />
  </SWRDevTools>,
  document.getElementById("app")
);
```

</details>

## Packages

| package                                                       | description                                  |
| ------------------------------------------------------------- | -------------------------------------------- |
| [swr-devtools](./packages/swr-devtools)                       | A React component to inject your application |
| [swr-devtools-extensions](./packages/swr-devtools-extensions) | A Chrome extension for the SWR DevTools      |
| [swr-devtools-panel](./packages/swr-devtools-panel)           | A React component for the SWR DevTools panel |

## Online Demo

https://swr-devtools.vercel.app

## LICENSE

[MIT](LICENSE.md)
