# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

## How to Use

### Install dependencies

```shell
# This package hasn't been published yet.
npm install swr-devtools
# Install peerDependencies
npm install react swr styled-components
```

**This only supports SWR v1 or later versions.**

### Wrap your application in the SWRDevTools component

```jsx
// This package hasn't been published yet.
import { SWRDevTools } from "swr-devtools";

const App = () => (
    <SWRDevTools>
      <MainApp />
    </SWRDevTools>
)
```

## LICENSE

[MIT](LICENSE.md)
