const { test } = require('uvu');
const {is} = require('uvu/assert');
const sveltePaths = require('./wrapper');

function relative(fullpath){
    return fullpath.replace(__dirname,'.')
}

test('Filter test', async () => {
    const unmatched = [
        'foo/bar',
        'foo/Bar.svelte',
        'Foo/Foo.svelte',
        'Foo',
        '@foo/Foo.svelte',
    ]

    const matched = [
        './Foo',
        './Bar',
        './Foo/Foo',
        '@foo/Foo',
    ]
    
    for(let p of unmatched){
        is((await sveltePaths(p)), null,p)
    }

    for(let p of matched){
        is.not((await sveltePaths(p)), null,p)
    }
});

test('Svelte path resolving', async () => {
    is(relative(await sveltePaths('./Foo')), './Foo/Foo.svelte','./Foo')
    is(relative(await sveltePaths('./Foo/Foo')), './Foo/Foo.svelte','./Foo/Foo')
    is(relative(await sveltePaths('@foo/Foo')), './Foo/Foo.svelte','@foo/Foo')
    is(relative(await sveltePaths('./Bar')), './Bar.svelte','./Bar')
});

test.run();