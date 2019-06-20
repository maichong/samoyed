
interface Params<T> {
  list: T[];
  dragging: T;
  hover: T;
}

export default function dragHover<T>(params: Params<T>): T[] | null;
