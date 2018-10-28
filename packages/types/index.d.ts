/**
 * 对象Map
 */
export interface ObjectMap<T> {
  [key: string]: T
}

/**
 * Sizes
 */
export type Sizes = 'xs' | 'xsmall' | 'sm' | 'small' | 'medium' | 'lg' | 'large';

export interface SizeProps {
  xs?: boolean;
  sm?: boolean;
  lg?: boolean;
}

/**
 * 样式类型
 */
export type Colors = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;

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
  color?: Colors;
}
