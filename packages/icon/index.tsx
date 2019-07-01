import * as React from 'react';
import app from '@samoyed/app';
import { IconProps } from '.';

export default function Icon(props: IconProps) {
  const { className, name } = props;
  let fontFamily = props.fontFamily || app.defaults.iconFontFamily;
  let namePrefix = props.namePrefix || app.defaults.iconNamePrefix;
  let cls = `s-icon ${fontFamily} ${namePrefix}${name}`;
  if (className) {
    cls += ` ${className}`;
  }
  return <i className={cls} />;
}
