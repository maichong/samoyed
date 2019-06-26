import * as _ from 'lodash';

function set<T>(object: T, key: string | number, value: any): T {
  object = Object.assign({}, object);
  // @ts-ignore indexer
  object[key] = value;
  return object;
}

function setIn(object: any, paths: Array<string | number>, value: any) {
  let objects = [object];
  let current = object;
  for (let i = 0; i < paths.length - 1; i++) {
    let key = paths[i];
    // @ts-ignore indexer
    current = current[key];
    objects.push(current);
  }
  current = value;
  for (let i = objects.length - 1; i >= 0; i -= 1) {
    current = set(objects[i], paths[i], current);
    objects[i] = current;
  }
  return objects[0];
}

function without<T extends object>(object: T, key: string | string[]): T {
  // @ts-ignore
  if (_.isArray(key)) return _.omit(object, key);
  object = Object.assign({}, object);
  // @ts-ignore indexer
  delete object[key];
  return object;
}

function merge<T extends object>(object: T, data: any): T {
  return Object.assign({}, object, data);
}

export default {
  set,
  setIn,
  without,
  merge
};
