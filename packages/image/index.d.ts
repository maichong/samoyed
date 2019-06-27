import * as React from 'react';

export interface ImageProps {
  /**
   * 组件附加的样式类
   */
  className?: string;
  /**
   * 图片地址
   */
  url?: string;
  /**
   * 图片高度
   */
  height?: number | string;
  /**
   * 宽度
   */
  width?: number | string;
  /**
   * 图片模式
   */
  mode?: 'cover' | 'contain';
}

export default class Image extends React.Component<ImageProps> {
}
