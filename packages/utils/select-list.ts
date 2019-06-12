import * as _ from 'lodash';
import app from '@samoyed/app';
import { List, ListSelector } from '.';

function emptyAsNull(data: any): any {
  return !data || _.isEmpty(data) ? null : data;
}

export function matchList(list: List, selector: ListSelector): boolean {
  let { search = '', sort = '', limit = app.defaults.listLimit || 0 } = selector;
  let matched = list.search === search && list.sort === sort && list.limit === limit;
  if (!matched) return false;
  if (!_.isEqual(emptyAsNull(list.filters), emptyAsNull(selector.filters))) return false;
  return _.isEqual(emptyAsNull(list.populations), emptyAsNull(selector.populations));
}

export default function selectList<T extends List>(lists: ArrayLike<T>, selector: ListSelector): T | null {
  if (!lists) return null;
  for (let i in lists) {
    if (matchList(lists[i], selector)) {
      return lists[i];
    }
  }
  return null;
}
