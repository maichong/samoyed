import { List, ListSelector } from '.';

export { List , ListSelector };

export function matchList(list: List, selector: ListSelector): boolean;

export default function selectList<T extends List>(lists: ArrayLike<T>, selector: ListSelector): T | null;
