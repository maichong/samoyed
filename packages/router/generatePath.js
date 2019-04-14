"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;
function compilePath(path) {
    if (cache[path])
        return cache[path];
    const generator = pathToRegexp.compile(path);
    if (cacheCount < cacheLimit) {
        cache[path] = generator;
        cacheCount++;
    }
    return generator;
}
function generatePath(path = '/', params = {}) {
    return path === '/' ? path : compilePath(path)(params);
}
exports.default = generatePath;
