/**
 * 对象Map
 */
export interface ObjectMap<T> {
  [key: string]: T;
}

/**
 * Box布局方式
 */
export type Layout = 'fit' | 'card' | 'horizontal' | 'vertical';

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

/**
 * Redux数据通用格式
 */
export interface ReduxData {
  request: string;
  fetching: boolean;
  loaded?: boolean;
  error?: Error | null;
}

/**
 * Redux中数据列表通用格式
 */
export interface ReduxList<T> extends ReduxData {
  search: string;
  filters?: any | null;
  results: T[];
}

/**
 * Redux中分页数据列表通用格式
 */
export interface ReduxPaginateList<T> extends ReduxList<T> {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  previous: number;
  next: number;
}

export interface ErrorsMap {
  [key: string]: null | string | string[] | ErrorsMap | ErrorsMap[];
}

export type Errors = null | string | string[] | ErrorsMap | ErrorsMap[];

export type AnimationType = 'fade' | 'slide' | 'cover' | 'cover-fade' | string;

export type AnimationEasing = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' |
  'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint' |
  'easeInSine' | 'easeOutSine' | 'easeInOutSine' | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo' |
  'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc' | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic' |
  'easeInBack' | 'easeOutBack' | 'easeInOutBack' | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

export interface Animation {
  /**
   * 动画效果
   */
  type: AnimationType;
  /**
   * 动画持续时间
   */
  duration?: number;
  /**
   * 效果曲线
   */
  easing?: AnimationEasing;
  /**
   * 动画方向
   */
  direction?: 'horizontal' | 'vertical';
}
