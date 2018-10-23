export interface ObjectMap<T> {
  [key: string]: T
}

export type Style = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;

export type SelectValue = string | number | boolean;

export interface SelectOption {
  label?: string;
  value: SelectValue;
  style?: Style;
}
