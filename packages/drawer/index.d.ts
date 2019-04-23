import * as React from 'react';
import { BoxProps } from '@samoyed/box';

type RenderFunction = () => React.ReactNode;

export interface DrawerProps extends BoxProps {
  /**
   * 抽屉元素
   */
  drawer: React.ReactNode | RenderFunction;
  /**
   * 抽屉位置
   */
  placement: 'top' | 'right' | 'bottom' | 'left';
  /**
   * 是否可手动滑动抽屉，默认情况下会判断 app.is.touch
   */
  draggable?: boolean;
  /**
   * 抽屉弹出模式，默认为 cover
   */
  mode?: 'cover' | 'slide';
  /**
   * 主体容器样式类
   */
  containerClassName?: string;
  /**
   * 抽屉容器样式类
   */
  drawerClassName?: string;
  /**
   * 当前是否可见
   */
  show?: boolean;
  /**
   * 显示回调，当手动滑动打开后回调
   */
  onShow?: () => void;
  /**
   * 隐藏回调，当手动滑动关闭，或点击mask区域后回调
   */
  onHide?: () => void;
}

export default class Drawer extends React.Component<DrawerProps> {
}
