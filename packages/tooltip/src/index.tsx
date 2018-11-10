import * as React from 'react';
import classNames from 'classnames';
import { TooltipProps } from '..';

export default class Tooltip extends React.Component<TooltipProps> {
  static defaultProps = {
    placement: 'left'
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
        className={classNames(className, 'tooltip', `bs-tooltip-${placement}`)}
        {...props}
      >
        <div className="arrow" {...arrowProps} />
        <div className={`tooltip-inner`}>{children}</div>
      </div>
    );
  }
}
