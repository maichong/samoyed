import { Component, ReactNode } from 'react';
import { Style, SelectValue, SelectOption } from '@samoyed/types';

export interface LoadOptionsResult {
  options: SelectOption[];
}

export interface LoadOptionsCallback {
  (error: Error | null, result: LoadOptionsResult): void;
}

export interface LoadOptionsFunction {
  (keyword: string, callback: LoadOptionsCallback): void;
}

export interface SelectProps {
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
  disabled?: boolean,
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
  /**
   * 是否可搜索
   */
  searchable?: boolean;
  /**
   * 是否可清空
   */
  clearable?: boolean;
  /**
   * 选项加载器
   */
  loadOptions?: LoadOptionsFunction;
}

export default class Select extends Component<SelectProps>{
}
