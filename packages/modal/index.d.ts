import { Component, ReactNode } from 'react';

export type Style = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;

export interface ButtonOptions {
  text: string;
  style?: Style;
}

export interface AlertOptions {
  theme?: string,
  buttons?: ButtonOptions[],
  handle?: Function,
  closeButton?: boolean,
  props?: Object
}

export interface ConfirmOptions extends AlertOptions {
}

export interface PromptOptions extends AlertOptions {
  placeholder?: string;
}

export function alert(title: ReactNode, body?: ReactNode | typeof Component, options?: AlertOptions): Promise<void>;

export function confirm(title: ReactNode, body?: ReactNode | typeof Component, options?: ConfirmOptions): Promise<number>;

export function prompt(title: ReactNode, body?: ReactNode, options?: PromptOptions): Promise<string>;

export default class ModalBus extends Component<{}>{
}
