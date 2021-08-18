# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

![A screenshot of SWR Devtools (light theme)](./imgs/light.png)

![A screenshot of SWR Devtools (dark theme)](./imgs/dark.png)

## How to Use

### 1.Install this Chrome extension

**THIS HAS NOT BEEN PUBLISHED YET**

### 2.Inject runtime code for swr-devtools (recommended)

```js
import { cache } from "swr";

if (typeof window !== "undefined") {
  window.__SWR_DEVTOOLS__?.launch(cache);
}

```

## Use this as a React Component

[SWRDevTools](./packages/swr-devtools/)

## LICENSE

[MIT](LICENSE.md)
