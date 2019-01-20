import * as React from 'react';
import { ToastContainer as Container } from 'react-toastr';
import { ToastContainerProps, ToastType, ToastOptions } from '.';

let container: any = null;

export const defaultOptions: ToastOptions = {
  type: 'info',
  closeButton: true,
  showAnimation: 'animated fadeInRight',
  hideAnimation: 'animated fadeOutRight',
  timeOut: 5000
};

export class ToastContainer extends React.Component<ToastContainerProps> {
  ref: any;

  componentWillUnmount() {
    if (container === this.ref) {
      container = null;
    }
  }

  render() {
    return (
      <Container
        // toastMessageFactory 可选，但ts会报错，所以显式传入一个 undefined
        // eslint-disable-next-line no-undefined
        toastMessageFactory={undefined}
        className={this.props.className}
        ref={(r: any) => {
          this.ref = r;
          container = r;
        }}
      />
    );
  }
}

export function clear() {
  if (!container) return;
  container.clear();
}

function create(type?: ToastType) {
  return function (title: React.ReactNode, body?: React.ReactNode, options?: ToastOptions) {
    if (!container) throw new Error('Toast container is not initialized');
    if (!options && body && typeof body === 'object' && !React.isValidElement(body)) {
      // @ts-ignore
      options = body;
      body = '';
    }
    options = options || {};
    let t = options.type || type || defaultOptions.type;
    for (let key in defaultOptions) {
      if (!options.hasOwnProperty(key)) {
        options[key as keyof ToastOptions] = defaultOptions[key as keyof ToastOptions];
      }
    }
    container[t](body, title, options);
  };
}

export const success = create('success');
export const info = create('info');
export const error = create('error');
export const warning = create('warning');

export default create();
