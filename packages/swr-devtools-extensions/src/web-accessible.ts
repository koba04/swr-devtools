import { createSWRDevtools } from "swr-devtools/lib/createSWRDevTools";

const [middleware] = createSWRDevtools();

// @ts-expect-error
window.__SWR_DEVTOOLS_USE__ = [middleware];
