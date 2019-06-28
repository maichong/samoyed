import * as React from 'react';

export interface IconProps {
  /**
   * 图标名称
   */
  name: string;

  /**
   * 图标所属字体，默认采用 app.defaults.iconFontFamily 的设置
   */
  fontFamily?: string;

  /**
   * 图标名称前缀，默认采用 app.defaults.iconNamePrefix 的设置
   */
  namePrefix?: string;

  /**
   * 图标附加的CSS类
   */
  className?: string;
}

declare const Icon: React.FunctionComponent<IconProps>;

export default Icon;
