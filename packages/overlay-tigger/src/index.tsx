import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import contains from 'dom-helpers/query/contains';
import Overlay from '@samoyed/overlay';
import { OverlayTriggerProps } from '..';

interface OverlayTriggerState {
  show: boolean;
}

class RefHolder extends React.Component {
  render() {
    return this.props.children;
  }
}

const normalizeDelay = delay =>
  delay && typeof delay === 'object' ? delay : { show: delay, hide: delay };

export default class OverlayTrigger extends React.Component<OverlayTriggerProps, OverlayTriggerState> {
  static defaultProps = {
    defaultOverlayShown: false,
    trigger: ['hover', 'focus'],
  };

  _hoverState: 'show' | 'hide';
  _timeout: number;
  trigger: React.RefObject<any>;
  ariaModifier: {
    enabled: boolean,
    order: number,
    fn: (data: any) => any;
  };

  constructor(props, context) {
    super(props, context);

    this.trigger = React.createRef();
    this.state = {
      show: !!props.defaultShow,
    };

    // We add aria-describedby in the case where the overlay is a role="tooltip"
    // for other cases describedby isn't appropriate (e.g. a popover with inputs) so we don't add it.
    this.ariaModifier = {
      enabled: true,
      order: 900,
      fn: data => {
        const { popper } = data.instance;
        // @ts-ignore target 为 Element，不为Text
        const target: Element = this.getTarget();
        if (!this.state.show || !target) return data;

        const role = popper.getAttribute('role') || '';
        if (popper.id && role.toLowerCase() === 'tooltip') {
          target.setAttribute('aria-describedby', popper.id);
        }
        return data;
      },
    };
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  getChildProps() {
    return React.Children.only(this.props.children).props;
  }

  getTarget = () => ReactDOM.findDOMNode(this.trigger.current);

  handleShow = () => {
    clearTimeout(this._timeout);
    this._hoverState = 'show';

    const delay = normalizeDelay(this.props.delay);

    if (!delay.show) {
      this.show();
      return;
    }

    this._timeout = setTimeout(() => {
      if (this._hoverState === 'show') this.show();
    }, delay.show);
  };

  handleHide = () => {
    clearTimeout(this._timeout);
    this._hoverState = 'hide';

    const delay = normalizeDelay(this.props.delay);

    if (!delay.hide) {
      this.hide();
      return;
    }

    this._timeout = setTimeout(() => {
      if (this._hoverState === 'hide') this.hide();
    }, delay.hide);
  };

  handleFocus = e => {
    const { onFocus } = this.getChildProps();
    this.handleShow();
    if (onFocus) onFocus(e);
  };

  handleBlur = e => {
    const { onBlur } = this.getChildProps();
    this.handleHide();
    if (onBlur) onBlur(e);
  };

  handleClick = e => {
    const { onClick } = this.getChildProps();

    if (this.state.show) this.hide();
    else this.show();

    if (onClick) onClick(e);
  };

  handleMouseOver = e => {
    this.handleMouseOverOut(this.handleShow, e, 'fromElement');
  };

  handleMouseOut = e =>
    this.handleMouseOverOut(this.handleHide, e, 'toElement');

  // Simple implementation of mouseEnter and mouseLeave.
  // React's built version is broken: https://github.com/facebook/react/issues/4251
  // for cases when the trigger is disabled and mouseOut/Over can cause flicker
  // moving from one child element to another.
  handleMouseOverOut(handler, e, relatedNative) {
    const target = e.currentTarget;
    const related = e.relatedTarget || e.nativeEvent[relatedNative];

    // if ((!related || related !== target) && !contains(target, related)) {
    //   handler(e);
    // }
  }

  hide() {
    this.setState({ show: false });
  }

  show() {
    this.setState({ show: true });
  }

  render() {
    const {
      trigger,
      overlay,
      children,
      // popperConfig = {},
      ...props
    } = this.props;

    // delete props.delay;
    // delete props.defaultShow;

    const child = React.Children.only(children);

    const triggerProps: React.HTMLAttributes<any> = {};

    let triggers = trigger == null ? [] : [].concat(trigger);

    if (triggers.indexOf('click') !== -1) {
      triggerProps.onClick = this.handleClick;
    }

    if (triggers.indexOf('focus') !== -1) {
      triggerProps.onFocus = this.handleShow;
      triggerProps.onBlur = this.handleHide;
    }

    if (triggers.indexOf('hover') !== -1) {
      triggerProps.onMouseOver = this.handleMouseOver;
      triggerProps.onMouseOut = this.handleMouseOut;
    }

    return (
      <>
        <RefHolder ref={this.trigger}>
          {/* {cloneElement(child, triggerProps)} */}
        </RefHolder>
        <Overlay
          {...props}
          // popperConfig={{
          //   ...popperConfig,
          //   modifiers: {
          //     ...popperConfig.modifiers,
          //     ariaModifier: this.ariaModifier,
          //   },
          // }}
          show={this.state.show}
          onHide={this.handleHide}
          target={this.getTarget}
        >
          {overlay}
        </Overlay>
      </>
    );
  }
}
