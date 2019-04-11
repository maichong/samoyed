"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    const keys = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
function matchPath(pathname, opt = { path: '' }) {
    let options = typeof opt === 'string' ? { path: opt } : opt;
    const { path, exact = false, strict = false, sensitive = false } = options;
    const paths = [].concat(path);
    return paths.reduce((matched, path) => {
        if (matched)
            return matched;
        const { regexp, keys } = compilePath(path, {
            end: exact,
            strict,
            sensitive
        });
        const match = regexp.exec(pathname);
        if (!match)
            return null;
        const [url, ...values] = match;
        const isExact = pathname === url;
        if (exact && !isExact)
            return null;
        return {
            path,
            url: path === '/' && url === '' ? '/' : url,
            isExact,
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index];
                return memo;
            }, {})
        };
    }, null);
}
exports.default = matchPath;
