import * as pathToRegexp from 'path-to-regexp';
import { ObjectMap } from '@samoyed/types';

interface MatchOptions {
  path?: string;
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

interface CompileOptions {
  end: boolean;
  strict: boolean;
  sensitive: boolean;
}

interface Cache {
  [path: string]: {
    regexp: RegExp;
    keys: pathToRegexp.Key[];
  };
}

const cache: ObjectMap<Cache> = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path: string, options: CompileOptions) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache: Cache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys: pathToRegexp.Key[] = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * Public API for matching a URL pathname to a path.
 */
export default function matchPath(pathname: string, opt: string | MatchOptions = { path: '' }) {
  let options: MatchOptions = typeof opt === 'string' ? { path: opt } : opt;

  const { exact = false, strict = false, sensitive = false } = options;

  const paths = [options.path];

  return paths.reduce((matched, path) => {
    if (matched) return matched;
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo: any, key: pathToRegexp.Key, index: number) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}
