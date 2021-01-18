const fs = require('fs');
const path = require('path');

const jsconfig = './jsconfig.json';
const tsconfig = './tsconfig.json';

export function sveltePaths(){

    const conf = fs.existsSync(jsconfig) 
        ? JSON.parse(fs.readFileSync(jsconfig, 'utf8')) 
        : fs.existsSync(tsconfig)
            ? JSON.parse(fs.readFileSync(tsconfig, 'utf8')) 
            : null;


    function unAlias(filename){

        if(!conf || !conf.compilerOptions || !conf.compilerOptions.paths) return filename;

        const unstar = (str)=>str.replace(/\/\*$/,'/');
        for(let p in conf.compilerOptions.paths){
            const cleaned = unstar(p);
            if(filename === cleaned || filename.startsWith(cleaned)){
                return path.resolve(filename.replace(cleaned,path.join(
                    conf.baseURL || '',
                    unstar(conf.compilerOptions.paths[p][0])
                )))
            }
        }

        return filename;
    }
 
    return {
        name: 'esbuild-svelte-paths',
        setup(build) {
            build.onResolve({ filter: /\/[A-Z]\w+$/ }, args => {
                let fullpath = unAlias(args.path);
                if(fullpath.startsWith('.')) fullpath = path.join(args.resolveDir,fullpath);
                
                const name = path.basename(fullpath);
 
                const dirMatch = path.join(fullpath,name+'.svelte');
                const fileMatch = fullpath+'.svelte';
 
                if(fs.existsSync(dirMatch)) return {path: dirMatch};
                if(fs.existsSync(fileMatch)) return {path: fileMatch};
            });
        }
    }
}