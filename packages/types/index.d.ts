import { DependsQueryExpression } from 'check-depends';

/**
 * 对象Map
 */
export interface ObjectMap<T> {
  [key: string]: T;
}

/**
 * Box布局方式
 */
export type Layout = 'fit' | 'card' | 'horizontal' | 'vertical' | 'auto' | 'none';

/**
 * 位置
 */
export type Placement = 'top' | 'right' | 'bottom' | 'left';

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

export interface Field {
  label?: string;
  path?: string;
  default?: any;

  required?: DependsQueryExpression | EnvironmentCheck;
  /**
   * 禁用条件
   */
  disabled?: DependsQueryExpression | EnvironmentCheck;
  /**
   * 前端视图隐藏条件
   */
  hidden?: DependsQueryExpression | EnvironmentCheck;

  help?: string;

  // layout
  nolabel?: boolean;
  // fields
  match?: string;
  placeholder?: string;

  multiLine?: boolean;
  addonAfter?: string;
  addonBefore?: string;

  // select
  options?: SelectOption[];
  checkbox?: boolean;
  switch?: boolean;
  multi?: boolean;

  // date
  format?: string;
  cellFormat?: string;
  dateFormat?: string;
  timeFormat?: string;

  // number
  max?: number;
  min?: number;
}

export interface FieldProps<T = any, E = Errors> {
  className?: string;
  record?: Record;
  error?: E | null;
  value: T;
  onChange: (v: T, error?: E | null) => any;

  // extends Field
  label?: React.ReactNode;
  default?: any;

  /**
   * 禁用条件
   */
  disabled?: boolean;

  help?: React.ReactNode;

  // fields
  placeholder?: string;

  multiLine?: boolean;
  addonAfter?: React.ReactNode;
  addonBefore?: React.ReactNode;

  // select
  options?: SelectOption[];
  checkbox?: boolean;
  switch?: boolean;
  multi?: boolean;

  // date
  format?: string;
  dateFormat?: string;
  timeFormat?: string;

  // number
  max?: number;
  min?: number;
}

export interface Record {
  id: string;
  [key: string]: any;
}

/**
 * 环境检查条件
 */
export interface EnvironmentCheckCondition {
  /**
   * 检查站点设置是否为真，以 ! 开头代表反向
   */
  site?: string;
  /**
   * 检查用户字段是否为真，以 ! 开头代表反向
   */
  user?: string;
  /**
   * 检查用户是否拥有指定权限，以 ! 开头代表反向
   */
  ability?: string;
  /**
   * 检查数据依赖
   */
  depends?: DependsQueryExpression;
  /**
   * 检查 OR 条件数组
   */
  $or?: EnvironmentCheckCondition[];
  /**
   * 检查 AND 条件数组
   */
  $and?: EnvironmentCheckCondition[];
}

/**
 * 环境检查条件数组，每个元素都是一个条件，所有条件全部成立时，检查才通过
 */
export type EnvironmentCheck = EnvironmentCheckCondition[];
