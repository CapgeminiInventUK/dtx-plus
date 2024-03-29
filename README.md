# DTX Plus

[<img src="https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/mPGKYBIR2uCP0ApchDXE.png">](https://chrome.google.com/webstore/detail/dtx-plus/eacgncpmooemcegbgjfikjjnojbjfojj)

This plugin provides polyfills for a variety of functions in the DTX tool. 

Features include:

- Fix Chrome compatibility for submitting claims
- Fixed input field bugs
- Graphical fixes
- Work days select mode (autofill 7.5 hrs)
- Show bank holidays
- Auto-login
- Workdays select mode major improvements and fixes
- Workdays select mode click-drag selection
- Autofill month: Work days, all and clear
- Autofill task number & project code
- Shortcut keys (CTRL+S: save, ESC: home)
- Menubar shortcut button to add "Standard Time in UK"
- UI improvements and fixes

## Setup

### Prerequisites

* [nvm](https://github.com/nvm-sh/nvm)

### Install

```shell
nvm install && npm install
```

## Build

```shell
npm run build
```

## Build in watch mode

```shell
npm run watch
```

## Test local buildLoad extension to chrome

- Go to the Extensions page by entering ``chrome://extensions` in a new tab
- Enable Developer Mode by clicking the toggle switch next to Developer mode.
- Click the **Load Unpacked** button and select the `dist` directory

## Test

```shell
npm run test
``` 

## Create .zip file

```shell
npm run package
```
