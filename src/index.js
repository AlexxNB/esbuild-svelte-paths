const fs = require('fs');
const path = require('path');

const confFiles = [
    "tsconfig.json",
    "jsconfig.json"
]

export function sveltePaths(){

    let conf = null;

    const confFile = fs.existsSync(confFiles[0]) 
                        ? confFiles[0]
                        : fs.existsSync(confFiles[1]) 
                            ? confFiles[1] 
                            : null

    
    try{
        if(confFile) conf = JSON.parse(stripComments(fs.readFileSync(confFile, 'utf8')));  
    }catch{
        console.warn(`[esbuild-svelte-paths] Your ${confFile} is invalid and ignored`);
    }

    function unAlias(filename){

        if(!conf || !conf.compilerOptions || !conf.compilerOptions.paths) return filename;

        const unstar = (str)=>str.replace(/\/\*$/,'/');
        for(let p in conf.compilerOptions.paths){
            const cleaned = unstar(p);
            if(filename === cleaned || filename.startsWith(cleaned)){
                return path.resolve(filename.replace(cleaned,path.join(
                    conf.baseURL || conf.compilerOptions.baseURL || '',
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

                let fullpath = unAlias(args.path);
                if(fullpath.startsWith('.')) fullpath = path.join(args.resolveDir,fullpath);
                
                const name = path.basename(fullpath);
 
                const dirMatch = path.join(fullpath,name+'.svelte');
                const fileMatch = fullpath+'.svelte';

                if( (await fileExists(dirMatch)) ) 
                    return {path: dirMatch};
                else if( (await fileExists(fileMatch)) ) 
                    return {path: fileMatch};
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

function stripComments(text){
    return text.replace(/\/\/.*$|^\s*\/\*[\s\S]*\*\/\s*$/gm,'');
}