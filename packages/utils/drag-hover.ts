import * as _ from 'lodash';

interface Params<T> {
  list: T[];
  dragging: T;
  hover: T;
}

export default function dragHover<T>(params: Params<T>): T[] | null {
  const { list, dragging, hover } = params;
  if (!dragging || list.length < 2) return null;
  if (dragging === hover) return null;
  let draggingIndex = list.indexOf(dragging);
  let hoverIndex = list.indexOf(hover);
  if (draggingIndex < 0 || hoverIndex < 0) return null;
  return _.flatMap(list, (record) => {
    if (record === dragging) {
      return [];
    }
    if (record === hover) {
      if (draggingIndex > hoverIndex) {
        return [dragging, hover];
      }
      return [hover, dragging];
    }
    return [record];
  });
}
