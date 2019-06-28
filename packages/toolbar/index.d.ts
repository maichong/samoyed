import * as React from 'react';
import { BoxProps } from '@samoyed/box';
import { Colors, Placement } from '@samoyed/types';

export interface Tool {
  /**
   * Tool按钮文字
   * text 和 icon 至少应选其一
   */
  text?: React.ReactNode;
  /**
   * Tool图标
   */
  icon?: string;
  /**
   * Tool颜色
   */
  color?: Colors;
  /**
   * 提示信息
   */
  tooltip?: React.ReactNode;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 位置，默认在右侧
   */
  placement?: 'right' | 'left';
  /**
   * 回调函数
   */
  onClick?: () => any;
}

export interface ToolbarProps extends BoxProps {
  /**
   * Toolbar 颜色
   */
  color?: Colors;
  /**
   * Toolbar 图标
   */
  icon?: string;
  /**
   * Toolbar 标题
   */
  title?: string;
  /**
   * Toolbar 文字对齐
   */
  titleAlign?: 'left' | 'center' | 'right';
  /**
   * Toolbar 工具按钮列表
   */
  tools?: Array<Tool | React.ReactNode>;
  /**
   * Toolbar 显示位置，默认为 top
   */
  placement?: Placement;
}

declare const Toolbar: React.FunctionComponent<ToolbarProps>;

export default Toolbar;
