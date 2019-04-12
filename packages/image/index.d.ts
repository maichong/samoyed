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
   * 淡入过渡时间
   */
  timeIn?: string;
}

export default class Image extends React.Component<ImageProps> {
}
