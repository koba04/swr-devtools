# swr-devtools

**THIS IS NOT READY FOR THE USE IN YOUR PROJECT, JUST AN EXPERIMENT**

## How to Use

### Use the devtools as a component to put it yourself

You can also use `swr-devtools` as a React Component.

#### Install dependencies

```shell
# This package hasn't been published yet.
npm install swr-devtools
# Install peerDependencies
npm install react swr styled-components
```

#### Place the SWRDevTools Component

```jsx
import { cache } from "swr";
// This package hasn't been published yet.
import { SWRDevTools } from "swr-devtools";

const App = () => (
    <>
      <MainApp />
      <SWRDevTools cache={cache} />
    </>
)
```

## LICENSE

[MIT](LICENSE.md)
