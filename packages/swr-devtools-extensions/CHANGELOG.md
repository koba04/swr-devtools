# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.1.0](https://github.com/koba04/swr-devtools/compare/v1.0.0...v1.1.0) (2022-07-12)


### Bug Fixes

* a hydration error in SSR apps ([#76](https://github.com/koba04/swr-devtools/issues/76)) ([c30626f](https://github.com/koba04/swr-devtools/commit/c30626f44ec2eab1dabe81ee101aef4fbf19c2d2))





# [0.5.0](https://github.com/koba04/swr-devtools/compare/v0.4.0...v0.5.0) (2022-06-01)


### Features

* support manifest v3 ([#53](https://github.com/koba04/swr-devtools/issues/53)) ([eb638bf](https://github.com/koba04/swr-devtools/commit/eb638bf83ec00971458b283da80741150fc5554c))
* support SWR v2 ([#44](https://github.com/koba04/swr-devtools/issues/44)) ([388a4bf](https://github.com/koba04/swr-devtools/commit/388a4bff545c76414f768c26b34aa858bc1f0291))





# [0.4.0](https://github.com/koba04/swr-devtools/compare/v0.3.0...v0.4.0) (2021-12-05)

**Note:** Version bump only for package swr-devtools-extensions





# [0.3.0](https://github.com/koba04/swr-devtools/compare/v0.2.2...v0.3.0) (2021-10-14)


### Features

* support Firefox Extension ([#29](https://github.com/koba04/swr-devtools/issues/29)) ([27f5f0e](https://github.com/koba04/swr-devtools/commit/27f5f0e186fc45dcd5f39862f4788c3a33ba6b18))





## [0.2.2](https://github.com/koba04/swr-devtools/compare/v0.2.0...v0.2.2) (2021-09-16)


### Bug Fixes

* reset a devtool panel when a navigation is happen ([#24](https://github.com/koba04/swr-devtools/issues/24)) ([1cc108b](https://github.com/koba04/swr-devtools/commit/1cc108bf3556b65b8d251e3b22af9505ea28e8da))
* sync SWRDevTools and a devtool panel ([#27](https://github.com/koba04/swr-devtools/issues/27)) ([ba34e6f](https://github.com/koba04/swr-devtools/commit/ba34e6ff3be261cd656a5d90f0b4bef64e1b71e8))





## [0.2.1](https://github.com/koba04/swr-devtools/compare/v0.2.0...v0.2.1) (2021-09-16)


### Bug Fixes

* reset a devtool panel when a navigation is happen ([#24](https://github.com/koba04/swr-devtools/issues/24)) ([1cc108b](https://github.com/koba04/swr-devtools/commit/1cc108bf3556b65b8d251e3b22af9505ea28e8da))
* sync SWRDevTools and a devtool panel ([#27](https://github.com/koba04/swr-devtools/issues/27)) ([ba34e6f](https://github.com/koba04/swr-devtools/commit/ba34e6ff3be261cd656a5d90f0b4bef64e1b71e8))





# 0.2.0 (2021-09-09)


### Bug Fixes

* a wrong dependency ([bc38f92](https://github.com/koba04/swr-devtools/commit/bc38f92e953a7caef7cc708fc0fc362b5a0daf62))
* an old path to the bundle js file ([56dc413](https://github.com/koba04/swr-devtools/commit/56dc4136ad698830b4e55be85841c22d0030af98))
* clean directories before running build scripts ([214150c](https://github.com/koba04/swr-devtools/commit/214150c70f6c7e823baff9ab2c16802dbb27afda))
* filter duplicated cache data and fix layouts ([501a389](https://github.com/koba04/swr-devtools/commit/501a389b269133e079bf075e1a1e619cb970a713))
* make a key name more explicit ([e263a98](https://github.com/koba04/swr-devtools/commit/e263a986b03e5e83edbf7eaf6cbed41b8752343b))
* sync cache data when opening a devtool panel ([40795db](https://github.com/koba04/swr-devtools/commit/40795dba659dbdbc883c199b59a318d9ad7c146d))
* update meta keys for v1 ([13058ac](https://github.com/koba04/swr-devtools/commit/13058ac4ec0e2f434c52246860b18b166b4af305))
* works well with v1 ([e7aba55](https://github.com/koba04/swr-devtools/commit/e7aba553ce7f2a3d77c25a0a436d58ccc4d342fa))


### Features

* add icons ([3e2365a](https://github.com/koba04/swr-devtools/commit/3e2365af28d9452a0536c0978798e0579c8d8e60))
* display SWRDevTools on the devtool panel ([de7e05a](https://github.com/koba04/swr-devtools/commit/de7e05a16e5be5c8211371d75f834492a11e6179))
* proxy panel events to a content port ([b727043](https://github.com/koba04/swr-devtools/commit/b72704381ee13975855eb67c1ba472f733285136))
* send cache data from a page to a content script ([97315c5](https://github.com/koba04/swr-devtools/commit/97315c501024a6346979460feb4f8b046e38f9d0))
* separate SWRDevToolsPanel as a separate package ([4ddbfdb](https://github.com/koba04/swr-devtools/commit/4ddbfdbeb7051ed4df5ded307461ab60820a4cf4))
* stop using web_accessible_resources to inject a runtime script ([0b5aad7](https://github.com/koba04/swr-devtools/commit/0b5aad79557291f8210bab369a71a9d9516098c3))
* support dark mode ([40d96a4](https://github.com/koba04/swr-devtools/commit/40d96a4b1158b367c0332737cbdb5c6cf0b0e268))
* support swr v1 beta ([9170f48](https://github.com/koba04/swr-devtools/commit/9170f4837b25436fbbde757b72c7b48bb862a16f))
* use cahce APIs exposed in v1 ([90a9775](https://github.com/koba04/swr-devtools/commit/90a977514d570c35b1157febe88b076d283f5a95))
* work on a devtools panel ([98120bd](https://github.com/koba04/swr-devtools/commit/98120bd591bddec37c2a0c69594098011b77c0a0))


### BREAKING CHANGES

* drop swr v0.x support
