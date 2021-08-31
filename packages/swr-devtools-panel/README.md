# swr-devtools-panel

**This is a private package.**

This package is a React component of SWR Devtools panel.


If you want to use this component as a React component and place it on your own, you should install `styled-components` as well as `react` and `swr`. But this is not a recommend way, and `swr-devtools-panel` hasn't been published yet.

```jsx
import { useSWRConfig } from "swr";
// This package hasn't been published yet.
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
