import { Component, ReactNode } from 'react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export interface ToastOptions {
  /**
   * 通知类型 'error' | 'success' | 'info' | 'warning'
   */
  type?: ToastType;
  /**
   * 消息样式类名
   */
  className?: string;
  /**
   * 是否显示关闭按钮，默认为true
   */
  closeButton?: boolean;
  /**
   * 关闭按钮点击回调
   */
  onCloseClick?: Function;
  /**
   * 显示动画
   */
  showAnimation?: string;
  /**
   * 消失动画
   */
  hideAnimation?: string;
  /**
   * 显示时间
   */
  timeOut?: number;
  /**
   * 标题区域样式类，默认	toast-title
   */
  titleClassName?: string;
  /**
   * 内容区域样式类，默认	toast-message
   */
  messageClassName?: string;
  /**
   * 图标样式类, 默认 iconClassNames[type]
   */
  iconClassName?: string;
  /**
   * 图标样式类映射，默认	{ error: "toast-error", info: "toast-info", success: "toast-success", warning: "toast-warning", }
   */
  iconClassNames?: {
    error: string;
    info: string;
    success: string;
    warning: string;
  }
}

export interface ToastContainerProps {
  className?: string;
}

export class ToastContainer extends Component<ToastContainerProps>{ }

export var defaultOptions: ToastOptions;
export function clear(): void;
export function error(title: ReactNode, body?: ReactNode, options?: ToastOptions): void;
export function success(title: ReactNode, body?: ReactNode, options?: ToastOptions): void;
export function info(title: ReactNode, body?: ReactNode, options?: ToastOptions): void;
export function warning(title: ReactNode, body?: ReactNode, options?: ToastOptions): void;

export default function toast(title: ReactNode, body?: ReactNode, options?: ToastOptions): void;
