# SWR DevTools Contributing Guidelines

Thank you for your contributions!

## Local Development

### Develop `swr-devtools-panel`

```
$ yarn install
$ yarn start
```

And then, open http://localhost:3000/.

### Develop SWR DevTools as Web Extension

#### Chrome

After the instruction of "Develop `swr-devtools-panel`", open chrome://extensions/ on Chrome and select the `dist/` directory from the `Load unpacked` button.
See more details on https://developer.chrome.com/docs/extensions/mv3/getstarted/.

#### Firefox

After the instruction of "Develop `swr-devtools-panel`", run `yarn workspace swr-devtools-extensions start:firefox`.
