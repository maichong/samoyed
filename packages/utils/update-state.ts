import * as React from 'react';
import immutable from './immutable';

const map = new WeakMap();

export default function updateState(ref: React.Component, path: string): (value: any) => any {
  let paths = map.get(ref);
  if (!paths) {
    paths = {};
    map.set(ref, paths);
  }
  let fn = paths[path];
  if (!fn) {
    let arr = path.split('.');
    let first = arr.shift();
    fn = (value: any) => {
      if (arr.length === 0) {
        ref.setState({
          [path]: value
        });
        return;
      }

      // @ts-ignore indexer
      let object = ref.state[first];
      object = immutable.setIn(object, arr, value);
      ref.setState({
        [first]: object
      });
    };
    paths[path] = fn;
  }
  return fn;
}
