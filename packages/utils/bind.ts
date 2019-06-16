
interface Bind {
  args: any[];
  fn: () => any;
}

const map: WeakMap<object, Bind[]> = new WeakMap();

export default function bind(ref: object, ...args: any[]): () => any {
  if (args.length > 3) throw new Error('too long args');
  let binds = map.get(ref);
  if (!binds) {
    binds = [];
    map.set(ref, binds);
  }
  let b: Bind;
  for (let item of binds) {
    if (
      item.args.length === args.length
      && item.args[0] === args[0]
      && item.args[1] === args[1]
      && item.args[2] === args[2]
    ) {
      b = item;
      break;
    }
  }
  if (!b) {
    let fn = args[args.length - 1];
    args = args.slice(0, args.length - 1);
    b = {
      args,
      fn: (...params: any[]) => {
        return fn.call(ref, ...args, ...params);
      }
    };
    binds.push(b);
  }
  return b.fn;
}
