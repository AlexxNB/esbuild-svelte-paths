# esbuild-svelte-paths

ESBuild Plugin that resolves shortcuted pathes for Svelte components. 

## Why you need this plugin?

When you developing a web-app using Svelte you must import components using full path of each file including long file extension `.svelte`. When your application grows you create subdirectories with components to group them by application area.


```js
import Button from './Button.svelte';
import Dashboard from './Dashboard/Dashboard.svelte';

```

With `esbuild-svelte-paths` plugin you can do imports much easier:

```js
import Button from './Button'; // just component's path without '.svelte'
import Dashboard from './Dashboard'; // folder and file inside have same names

```

## How it works?

Main rule for plugin – last part of the path **must starts with capital letter**. Then plugin resolves fullpath for Svelte component and checks if it is existed. 

When file and file inside directory are both matched with shortcut – the path to the file in the directory be returned.

Plugin respects [path aliases](https://www.typescriptlang.org/tsconfig#paths) from `tsconfig.json` or `jsconfig.json`.

## Getting started

Install from npm:

```sh
npm i -D esbuild-svelte-paths
```

Then add to your esbuild script **BEFORE** any Svelte compiler plugin:

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

## Caveat

If you use `ctr-click` to go to an import declaration or a path autocomplition in the IDE – you loose this feature for Svelte components imported with shorcuted path. 