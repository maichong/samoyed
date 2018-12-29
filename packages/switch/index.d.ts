import * as React from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';

export interface SwitchProps {
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
}

export default class Switch extends React.Component<SwitchProps> {
}
