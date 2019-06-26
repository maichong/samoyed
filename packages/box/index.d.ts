import * as React from 'react';
import { Layout, AnimationType, Animation, Placement, Colors } from '@samoyed/types';

declare module '@samoyed/app' {
  export interface Components {
    Box?: React.ComponentClass<BoxProps>;
  }
}

export interface ScrollData {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
}

export interface PullRefreshTexts {
  pull: React.ReactNode;
  release?: React.ReactNode;
  loading?: React.ReactNode;
  loaded?: React.ReactNode;
}

export type PullRefreshStatus = 'pull' | 'release' | 'loading' | 'loaded';

export type PullRefreshTextsFunction = (status: PullRefreshStatus) => React.ReactNode;

export interface BoxProps extends React.HTMLAttributes<Element> {
  /**
   * 子节点
   */
  childen?: React.ReactNode;
  /**
   * Box外层样式类
   */
  className?: string;
  /**
   * Box内层样式类
   */
  bodyClassName?: string;
  /**
   * Box内层样式
   */
  bodyStyle?: React.CSSProperties;
  /**
   * 背景色
   */
  bg?: Colors;
  /**
   * Box高度
   */
  height?: number | string;
  /**
   * Box宽度
   */
  width?: number | string;
  /**
   * 外层div ref
   */
  elRef?: (instance: any | null) => void;
  /**
   * 内层div ref
   */
  bodyRef?: (instance: any | null) => void;
  /**
   * 停靠组件
   */
  dock?: React.ReactNode;
  /**
   * 停靠位置，默认为 top
   */
  dockPlacement?: Placement;
  /**
   * 前置插件
   */
  addonAfter?: React.ReactNode;
  /**
   * 后置插件
   */
  addonBefore?: React.ReactNode;
  /**
   * Box包裹层
   */
  wrapper?: string;
  /**
   * Box包裹层组件Props
   */
  wrapperProps?: any;
  /**
   * Box 滚动
   */
  scrollable?: 'both' | 'horizontal' | 'vertical' | false | null;
  /**
   * 是否使用原生滚动，null为自动判断
   */
  nativeScroll?: boolean | null;
  /**
   * 是否自动伸缩，如果为true，则自动添加 s-flex 样式类
   */
  flex?: boolean;
  /**
   * 布局方式
   */
  layout?: Layout;
  /**
   * Card layout 当前激活项
   */
  activeItem?: number;
  /**
   * Card layout 子组件切换动画
   */
  animation?: AnimationType | Animation;
  /**
   * 当前Box是否激活状态，如果为true，则自动添加 s-active 样式类，用于过度动画
   */
  active?: boolean;
  /**
   * 是否为前一个激活Box，如果为true，则自动添加 s-previous 样式类，用于过度动画
   */
  previous?: boolean;
  /**
   * 是否为上一个激活Box，如果为true，则自动添加 s-last 样式类，用于过度动画
   */
  last?: boolean;
  /**
   * 监听div宽高变化
   */
  onResize?: (rect: ClientRect) => any;
  /**
   * Box内容滚动事件
   */
  onBodyScroll?: (data: ScrollData) => any;
  /**
   * 下拉刷新的显示文本
   */
  pullRefreshTexts?: React.ReactNode | PullRefreshTexts | PullRefreshTextsFunction | React.FunctionComponent<{ status: PullRefreshStatus }> | React.ComponentClass<{ status: PullRefreshStatus }>;
  /**
   * 触发下拉刷新，只有 scrollable 为 vertical/both 才可用
   */
  onPullRefresh?: (cb: Function) => any;
  /**
   * Box内容滚动触底，只有 scrollable 为 vertical/both 才可用
   */
  onReachBottom?: () => any;
  /**
   * Box内容滚动触底边距，用于提前触发 onReachBottom，默认为0
   */
  reachBottomBorder?: number;
}

export default class Box extends React.Component<BoxProps> {
}
