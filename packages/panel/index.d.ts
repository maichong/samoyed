import * as React from 'react';
import { BoxProps } from '@samoyed/box';
import { Tool } from '@samoyed/toolbar';
import { Placement, Colors } from '@samoyed/types';

export interface PanelProps extends BoxProps {
  /**
   * Panel 边框
   */
  border?: boolean;
  /**
   * Panel Body 内间距
   */
  bodyPadding?: number | string | boolean;
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
   * 自定义标题栏，
   * 如果指定了 header，那么 icon/title/titleAlign/tools 都将无效
   */
  header?: React.ReactNode;
  /**
   * 标题栏位置
   */
  headerPlacement?: Placement;
}

declare const Panel: React.FunctionComponent<PanelProps>;

export default Panel;
