import * as React from 'react';
import { IconProps } from '.';

export default class Icon extends React.Component<IconProps> {
  render() {
    const { className, name } = this.props;
    let cls = `fa fa-${name}`;
    if (className) {
      cls += ` ${className}`;
    }
    return <i className={cls} />;
  }
}
