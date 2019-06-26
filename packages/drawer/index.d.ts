import * as React from 'react';
import { BoxProps } from '@samoyed/box';
import { Placement } from '@samoyed/types';

declare module '@samoyed/app' {
  export interface Components {
    Drawer?: React.ComponentClass<DrawerProps>;
  }
}

type RenderFunction = () => React.ReactNode;

export type Mode = 'cover' | 'slide';

export interface DrawerProps extends BoxProps {
  /**
   * 抽屉元素
   */
  drawer: React.ReactNode | RenderFunction;
  /**
   * 抽屉位置
   */
  placement: Placement;
  /**
   * 是否可手动滑动抽屉，默认情况下会判断 app.is.touch
   */
  draggable?: boolean;
  /**
   * 抽屉弹出模式，默认为 cover
   */
  mode?: Mode;
  /**
   * 是否不显示mask层
   */
  noMask?: boolean;
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
  /**
   * 滑动边缘区域大小阈值，只有滑动边缘，才能出发抽屉打开动作，默认 0
   * 为 0 则允许全屏出发滑动
   */
  dragBorderSize?: number;
  /**
   * 方向锁定阈值，默认 10
   * 滑动开始后，x轴和y轴变化先到达此阈值，则锁定为该轴方向
   */
  directionLockThreshold?: number;
  /**
   * 抽屉组件Props
   */
  drawerProps?: BoxProps;
  /**
   * 内容组件Props
   */
  containerProps?: BoxProps;
}

export default class Drawer extends React.Component<DrawerProps> {
}
