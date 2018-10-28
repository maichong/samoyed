import React, { Component } from 'react';
import classNames from 'classnames';
import { TooltipProps } from '..';

export default class Tooltip extends Component<TooltipProps> {
  static defaultProps = {
    placement: 'right'
  };

  constructor(props: TooltipProps) {
    super(props);
  }

  render() {
    const {
      innerRef,
      placement,
      className,
      style,
      children,
      arrowProps,
      ...props
    } = this.props;
    return (
      <div
        // @ts-ignore
        ref={innerRef}
        style={style}
        role="tooltip"
        x-placement={placement}
        className={classNames(className, 'tooltip', `tooltip-${placement}`)}
        {...props}
      >
        <div className="arrow" {...arrowProps} />
        <div className={`tooltip-inner`}>{children}</div>
      </div>
    );
  }
}
