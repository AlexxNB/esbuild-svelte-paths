const esbuild = require('esbuild');
const pkg = require('./package.json');

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: pkg.main,
    format: 'cjs',
    platform: "node",
    minify: true,
    external: [
        'fs',
        'path'
    ]
});

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: pkg.module,
    format: 'esm',
    minify: true,
    external: [
        'fs',
        'path'
    ]
});