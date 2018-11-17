import * as React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import * as BaseOverlay from 'react-overlays/lib/Overlay';
import { OverlayProps } from '..';

// TODO: 还没找到怎么定义
function wrapRefs(props: any, arrowProps: any) {
  if (props && props.ref) {
    const { ref } = props;
    // eslint-disable-next-line react/no-find-dom-node
    props.ref = ref.__wrapped || (ref.__wrapped = (r: any) => ref(findDOMNode(r)));
  }
  if (arrowProps && arrowProps.ref) {
    const { ref } = arrowProps;
    // eslint-disable-next-line react/no-find-dom-node
    arrowProps.ref = ref.__wrapped || (ref.__wrapped = (r: any) => ref(findDOMNode(r)));
  }
}

export default class Overlay extends React.Component<OverlayProps> {
  static defaultProps = {
    rootClose: false,
    show: false,
    placement: 'top'
  };

  render() {
    const { children, onHide, ...overlayProps } = this.props;
    const { arrowProps, show, ...props } = overlayProps;

    wrapRefs(overlayProps, arrowProps);

    let child;
    // @ts-ignore children 不能为string/array等，必须为合法的Element
    let overlay: Function | ReactElement<any> = children;
    if (typeof overlay === 'function') {
      child = overlay({
        ...props,
        arrowProps,
      });
    } else {
      child = React.cloneElement(overlay, {
        ...props,
        arrowProps,
        className: classNames(
          overlay.props.className,
          show && 'show',
        ),
        style: { ...overlay.props.style, ...overlayProps.style },
      });
    }
    return (
      <BaseOverlay {...overlayProps}>
        {child}
      </BaseOverlay>
    );
  }
}
