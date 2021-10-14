# swr-devtools-panel

[![npm version](https://badge.fury.io/js/swr-devtools-panel.svg)](https://badge.fury.io/js/swr-devtools-panel)

This package is a React component of SWR Devtools panel. If you want to use this component as a React component, you can place it on your own.

**This package hasn't been stable yet, so its interface would be changed in the future releases.**
## Install

```
// install peerDependencies
$ yarn add react swr styled-components
$ yarn add swr-devtools-panel
```

## How to use

```jsx
import { useSWRConfig } from "swr";
import { SWRDevToolsPanel } from "swr-devtools-panel";

const App = () => {
  const { cache } = useSWRConfig();
  return (
    <SWRDevToolsPanel cache={cache}>
      <Page />
    </SWRDevToolsPanel>
  );
}
```

## LICENSE

[MIT](LICENSE.md)
