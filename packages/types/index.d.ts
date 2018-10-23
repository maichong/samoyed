/**
 * 对象Map
 */
export interface ObjectMap<T> {
  [key: string]: T
}

/**
 * 样式类型
 */
export type Style = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;

/**
 * 选择相关组件的取值类型
 */
export type SelectValue = string | number | boolean;

/**
 * 选择相关组件的可选项
 */
export interface SelectOption {
  label?: string;
  value: SelectValue;
  style?: Style;
}
