import * as React from 'react';

export interface CheckboxProps {
  /**
   * 组件附加的样式类
   */
  className?: string;
  /**
   * 是否是单选样式，如果为true，则显示为圆形单选框，默认显示方形多选框
   */
  radio?: boolean;
  /**
   * 当前值，true 为已选
   */
  value?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选择框标签文本
   */
  label?: React.ReactNode;
  /**
   * 修改事件回调
   */
  onChange?: Function;
}

export default class Checkbox extends React.Component<CheckboxProps> {
}
