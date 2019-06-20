function toFixed(value: number) {
  return parseFloat(value.toFixed(8));
}

function getSmallerSortValue(v: number = 0, current: number = 0) {
  v = Math.min(v, current);
  if (v > 2) {
    return toFixed(v / 2);
  }
  return v - 10000;
}

function getBiggerSortValue(v: number = 0, current: number = 0) {
  v = Math.max(v, current);
  return v + 10000;
}

interface Params<T> {
  oldList: T[];
  newList: T[];
  dragging: T;
  order: 'asc' | 'desc';
}

export default function dropSort<T extends { sort: number }>(params: Params<T>): number {
  const { oldList, newList, dragging, order } = params;
  let oldIndex = oldList.indexOf(dragging);
  let newIndex = newList.indexOf(dragging);
  if (oldIndex === newIndex) dragging.sort;

  let value = dragging.sort || 0;

  if (newIndex === oldList.length - 1) {
    // 被拖到了最后
    let last = oldList[newIndex];
    let sortValue = last.sort;
    if (order === 'asc') {
      value = getBiggerSortValue(sortValue, value);
    } else {
      value = getSmallerSortValue(sortValue, value);
    }
  } else if (newIndex === 0) {
    let sortValue = oldList[0].sort;
    // 被拖到了第一位
    if (order === 'asc') {
      value = getSmallerSortValue(sortValue, value);
    } else {
      value = getBiggerSortValue(sortValue, value);
    }
  } else {
    // 在中间
    let before = newList[newIndex - 1].sort || 0;
    let after = newList[newIndex + 1].sort || 0;
    if (before === after) {
      value = before;
    } else {
      value = toFixed((after - before) / 2) + before;
      // @ts-ignore parseInt number
      let intSort = parseInt(value);
      if (
        (before < intSort && intSort < after)
        || (before > intSort && intSort > after)
      ) {
        value = intSort;
      }
    }
  }

  return value;
}
