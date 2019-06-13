
interface Immutable {
  set<T>(object: T, key: string | number, value: any): T;
  setIn<T>(object: T, paths: Array<string | number>, value: any): T;
  without<T extends object>(object: T, key: keyof T | Array<keyof T>): T;
  merge<T extends object>(object: T, data: any): T;
}

declare const immutable: Immutable;

export default immutable;
