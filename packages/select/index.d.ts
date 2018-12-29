import * as React from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';
import { Props } from 'react-select/lib/Select';

export interface LoadOptionsResult {
  options: SelectOption[];
}

export interface LoadOptionsCallback {
  (error: Error | null, result: LoadOptionsResult): void;
}

export interface LoadOptionsFunction {
  (keyword: string, callback: LoadOptionsCallback): void;
}

// eslint-disable-next-line space-infix-ops
type Omit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export interface SelectProps extends Omit<Props, { options: any; value: any; isDisabled: any; isMulti: any }> {
  /**
   * 组件附加的样式类
   */
  className?: string;
  /**
   * 是否多选模式
   */
  multi?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否可清除
   */
  clearable?: boolean;
  /**
   * 当前值，如果多选模式，则为数组
   */
  value: SelectValue | SelectValue[];
  /**
   * 可选项目列表
   */
  options?: SelectOption[];
  /**
   * 修改事件回调
   */
  onChange: (value: any) => any;
  /**
   * 占位符
   */
  placeholder?: string;
  /**
   * 是否可动态创建
   */
  allowCreate?: boolean;
}

export default class Select extends React.Component<SelectProps> {
}
