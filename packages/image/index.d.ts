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
   * 动画持续时间
   */
  duration?: number;
}

export default class Image extends React.Component<ImageProps> {
}
