import React, { Component, ReactElement } from 'react';
import { findDOMNode } from 'react-dom';
import BaseOverlay from 'react-overlays/lib/Overlay';
import { OverlayProps } from '..';

function wrapRefs(props, arrowProps) {
  const { ref } = props;
  const { ref: aRef } = arrowProps;

  props.ref = ref.__wrapped || (ref.__wrapped = r => ref(findDOMNode(r)));
  arrowProps.ref = aRef.__wrapped || (aRef.__wrapped = r => aRef(findDOMNode(r)));
}

export default class Overlay extends Component<OverlayProps> {
  static defaultProps = {
    rootClose: false,
    show: false,
    placement: 'top'
  };

  render() {
    const {
      children, ...others
    } = this.props;

    // @ts-ignore children 不能为string/array等，必须为合法的Element
    let overlay: Function | ReactElement<any> = children;

    return (
      <BaseOverlay {...others}>
        {({ props: overlayProps, arrowProps, show, ...props }) => {
          wrapRefs(overlayProps, arrowProps);

          if (typeof overlay === 'function') {
            return overlay({
              ...props,
              ...overlayProps,
              show,
              arrowProps,
            });
          }

          return React.cloneElement(overlay, {
            ...props,
            ...overlayProps,
            arrowProps,
            style: { ...overlay.props.style, ...overlayProps.style },
          });
        }}
      </BaseOverlay>
    );
  }
}
