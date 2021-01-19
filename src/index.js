const fs = require('fs');
const path = require('path');

const jsconfig = './jsconfig.json';
const tsconfig = './tsconfig.json';

export function sveltePaths(){

    const cache = new Map();

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
            build.onResolve({ filter: /\/[A-Z]\w+$/ }, async args => {

                if(cache.has(args.path)) return {path: cache.get(args.path)};

                let fullpath = unAlias(args.path);
                if(fullpath.startsWith('.')) fullpath = path.join(args.resolveDir,fullpath);
                
                const name = path.basename(fullpath);
 
                const dirMatch = path.join(fullpath,name+'.svelte');
                const fileMatch = fullpath+'.svelte';

                let resolved = args.path;

                if( (await fileExists(dirMatch)) ) 
                    resolved = dirMatch;
                else if( (await fileExists(fileMatch)) ) 
                    resolved = fileMatch;

                cache.set(args.path,resolved)
                return {path: resolved};
                
            });
        }
    }
}

async function fileExists(path){
    try{
        await fs.promises.access(path);
    }catch{
        return false;
    }
    return true;
}