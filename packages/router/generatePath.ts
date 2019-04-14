import * as pathToRegexp from 'path-to-regexp';

const cache: {
  [path: string]: pathToRegexp.PathFunction;
} = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path: string) {
  if (cache[path]) return cache[path];

  const generator = pathToRegexp.compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}

/**
 * Public API for generating a URL pathname from a path and parameters.
 */
export default function generatePath(path = '/', params = {}) {
  return path === '/' ? path : compilePath(path)(params);
}
