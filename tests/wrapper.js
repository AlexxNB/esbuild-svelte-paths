const pkg = require('./../package.json');
const {sveltePaths} = require('./../'+pkg.main);

module.exports = function(path){
    return new Promise((resolve,reject)=>{
        sveltePaths().setup({
            async onResolve(options,fn){
                if(!options.filter.test(path)) return resolve(null);
                const result = await fn({
                    path,
                    resolveDir: __dirname
                })
                return resolve(result && result.path || path);
            }
        });
    });
}
