import * as React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import Tooltip from '@samoyed/tooltip';
import * as BaseOverlay from 'react-overlays/lib/Overlay';
import { OverlayProps } from '..';

//TODO 还没找到怎么定义
function wrapRefs(props: any, arrowProps: any) {
  if(props && props.ref){
    const { ref } = props;
    props.ref = ref.__wrapped || (ref.__wrapped = (r:any) => ref(findDOMNode(r)));
  }
  if(arrowProps && arrowProps.ref){
    const { ref } = arrowProps;
    arrowProps.ref = ref.__wrapped || (ref.__wrapped = (r:any) => ref(findDOMNode(r)));
  }
}

export default class Overlay extends React.Component<OverlayProps> {
  static defaultProps = {
    rootClose: false,
    show: false,
    placement: 'top'
  };

  render() {
    const {
      children, arrowProps, ...others
    } = this.props;

    wrapRefs(this.props, arrowProps);

    var child;
    // @ts-ignore children 不能为string/array等，必须为合法的Element
    let overlay: Function | ReactElement<any> = children;
    if (typeof overlay === 'function') {
      return overlay({
        ...this.props,
        arrowProps,
      });
    } else {
      child = React.cloneElement(overlay, {
        className: classNames(overlay.props.className, 'in')
      });
    }

    return React.createElement(BaseOverlay, Object.assign({}, this.props), child);
  }
}
