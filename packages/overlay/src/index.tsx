import * as React from 'react';
import { findDOMNode } from 'react-dom';
import Tooltip from '@samoyed/tooltip';
import * as BaseOverlay from 'react-overlays/lib/Overlay';
import { OverlayProps } from '..';

function wrapRefs(props: any, arrowProps: any) {
  const { ref } = props;
  const { ref: aRef } = arrowProps;

  props.ref = ref.__wrapped || (ref.__wrapped = (r:any) => ref(findDOMNode(r)));
  arrowProps.ref = aRef.__wrapped || (aRef.__wrapped = (r:any)=> aRef(findDOMNode(r)));
}

export default class Overlay extends React.Component<OverlayProps> {
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
    //todo 待续
    return (
      <BaseOverlay
      {...others}
      container={this}
      >
        <Tooltip>
          I&rsquo;m placed to the: <strong>{others.placement}</strong>
        </Tooltip>
      </BaseOverlay>
    )
    // return (
    //   <BaseOverlay {...others}>
    //     {
    //       (
    //         { props: overlayProps, arrowProps, show, ...props }: {
    //           props: any, arrowProps: any, show: boolean
    //         }
    //       ) => {
    //       wrapRefs(overlayProps, arrowProps);

    //       if (typeof overlay === 'function') {
    //         return overlay({
    //           ...props,
    //           ...overlayProps,
    //           show,
    //           arrowProps,
    //         });
    //       }

    //       return React.cloneElement(overlay, {
    //         ...props,
    //         ...overlayProps,
    //         arrowProps,
    //         style: { ...overlay.props.style, ...overlayProps.style },
    //       });
    //     }}
    //   </BaseOverlay>
    // );
  }
}
