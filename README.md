# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

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
