import * as React from 'react';
import { ToastContainer as Container } from 'react-toastr';
import { ToastContainerProps, ToastType, ToastOptions } from '..';

let container: any = null;

export const defaultOptions: ToastOptions = {
  type: 'success',
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
        // @ts-ignore toastMessageFactory为可选项 TODO暂时先忽略
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
    type = options.type || type || defaultOptions.type;
    for (let key in defaultOptions) {
      if (!options.hasOwnProperty(key)) {
        options[key as keyof ToastOptions] = defaultOptions[key as keyof ToastOptions];
      }
    }
    container[type](title, body, options);
  };
}

export const success = create('success');
export const info = create('info');
export const error = create('error');
export const warning = create('warning');

export default create();
