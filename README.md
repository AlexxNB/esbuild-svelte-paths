# esbuild-svelte-paths

ESBuild Plugin to resolve shortcuted pathes for Svelte components. 

## What is profit in?

You always should import Svelte's component by full filename. When there are a lot of components and directorie you would write *Something.svelte* again and again:

```js
import Button from './Button.svelte';
import Dashboard from './Dashboard/Dashboard.svelte';

```

With `esbuild-svelte-paths` plugin you can do imports much easier:

```js
import Button from './Button'; // just component's path without '.svelte'
import Dashboard from './Dashboard'; // folder and file inside have same names

```

Main rule for plugin - last part of the path **must starts with capital letter**. Then plugin resolves fullpath for Svelte component and checks if it is existed.

Plugin respects aliases from `tsconfig.json` or `jsconfig.json`.

## Getting started

Install from npm:

```sh
npm i -D esbuild-svelte-paths
```

Then add to your esbuild script BEFORE any Svelte compiler plugin:

```js
const {sveltePaths} = require('esbuild-svelte-paths');
const sveltePlugin = require('esbuild-any-svelte-plugin');

esbuild.build({
    ....
    plugins:[
        sveltePaths(),
        sveltePlugin()
    ]
})

```