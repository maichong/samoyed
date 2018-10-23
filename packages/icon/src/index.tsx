import React, { Component } from 'react';
import { IconProps } from '..';

export default class Icon extends Component<IconProps> {
  render() {
    const { className, name } = this.props;
    let cls = 'fa fa-' + name;
    if (className) {
      cls += ' ' + className;
    }
    return <i className={cls} />;
  }
}
