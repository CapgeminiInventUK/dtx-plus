# DTX Plus

> :construction: **Under construction** :construction:
>
> This is not ready for usage

Uses Chrome Extension TypeScript Starter

![build](https://github.com/chibat/chrome-extension-typescript-starter/workflows/build/badge.svg)

Chrome Extension, TypeScript and Visual Studio Code

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Option

* [Visual Studio Code](https://code.visualstudio.com/)

## Includes the following

* TypeScript
* Webpack
* React
* Jest
* Example Code
  * Chrome Storage
  * Settings Version 2
  * content script
  * count up badge number
  * background

## Project Structure

* src/typescript: TypeScript source files
* src/assets: static files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```shell
npm install
```

## Import as Visual Studio Code project

...

## Build

```shell
npm run build
```

## Build in watch mode

### terminal

```shell
npm run watch
```

### Visual Studio Code

Run watch mode.

type `Ctrl + Shift + B`

## Load extension to chrome

Load `dist` directory

## Test

`npx jest` or `npm run test`
