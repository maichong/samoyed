import * as React from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';
import { Props as CreatableProps } from 'react-select/lib/Creatable';

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

export interface SelectProps extends Omit<CreatableProps<SelectOption>, { options: any; value: any; isDisabled: any; isMulti: any }> {
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


  /* The default set of options to show before the user starts searching. When
     set to `true`, the results for loadOptions('') will be autoloaded.
     Default: false. */
  defaultOptions?: SelectOption[] | boolean;
  /* Function that returns a promise, which is the set of options to be used
     once the promise resolves. */
  loadOptions?: (inputValue: string, callback: ((options: SelectOption[]) => void)) => Promise<any> | void;
  /* If cacheOptions is truthy, then the loaded data will be cached. The cache
     will remain until `cacheOptions` changes value.
     Default: false. */
  cacheOptions?: any;
}

export default class Select extends React.Component<SelectProps> {
}
