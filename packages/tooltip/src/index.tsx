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
      target,
      ...props
    } = this.props;
    let newProps: { [key: string]: any } = {};
    let keys = Object.keys(props);
    for (let n = 0; n < keys.length; n++) {
      let key: string = keys[n];
      let keyLowerCase = key.toLocaleLowerCase();
      // @ts-ignore  只处理key为小写 boolean 为字符串
      newProps[keyLowerCase] = typeof(props[key]) === 'boolean' ? String(props[key]) : props[key];
    }
    return (
      <div
        // @ts-ignore
        ref={innerRef}
        style={style}
        role="tooltip"
        x-placement={placement}
        className={classNames(className, 'tooltip', `bs-tooltip-${placement}`)}
        {...newProps}
      >
        <div className="arrow" {...arrowProps} />
        <div className={`tooltip-inner`}>{children}</div>
      </div>
    );
  }
}
