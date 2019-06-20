interface Params<T> {
  oldList: T[];
  newList: T[];
  dragging: T;
  order: 'asc' | 'desc';
}

export default function dropSort<T>(params: Params<T>): number 
