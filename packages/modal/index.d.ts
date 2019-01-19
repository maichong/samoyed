import * as React from 'react';
import { Colors } from '@samoyed/types';

export interface ButtonOptions {
  text: string;
  color?: Colors;
}

/**
 * 通知框选项
 */
export interface AlertOptions {
  theme?: string;
  buttons?: ButtonOptions[];
  handle?: Function;
  closeButton?: boolean;
  props?: Object;
}

export interface ConfirmOptions extends AlertOptions {
}

export interface PromptOptions extends AlertOptions {
  /**
   * 占位符
   */
  placeholder?: string;
}

/**
 * 弹出通知对话框
 * @param {string|ReactNode} title 标题
 * @param {string|ReactNode|Component} [body] 内容
 * @param {AlertOptions} [options] 通知选项
 * @returns {Promise<void>}
 */
export function alert(title: React.ReactNode, body?: React.ReactNode | typeof React.Component, options?: AlertOptions): Promise<void>;

/**
 * 弹出确认对话框
 * @param {string|ReactNode} title 标题
 * @param {string|ReactNode|Component} [body] 内容
 * @param {ConfirmOptions} [options] 通知选项
 * @returns {Promise<number>} 返回按钮index数值
 */
export function confirm(title: React.ReactNode, body?: React.ReactNode | typeof React.Component, options?: ConfirmOptions): Promise<number>;

/**
 * 弹出输入对话框
 * @param {string|ReactNode} title 标题
 * @param {string|ReactNode|Component} [body] 内容
 * @param {ConfirmOptions} [options] 通知选项
 * @returns {Promise<string>} 返回用户输入的字符串
 */
export function prompt(title: React.ReactNode, body?: React.ReactNode, options?: PromptOptions): Promise<string>;

export default class ModalContainer extends React.Component<{}> {
}
