import { Component, ReactNode } from 'react';

export type Style = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link' | string;

export type SelectValue = string | number | boolean;

export interface SelectOption {
  label: string;
  value: SelectValue;
  style: Style;
}

export interface LoadOptionsResult {
  options: LoadOptionsFunction[];
}

export interface LoadOptionsCallback {
  (error: Error | null, result: LoadOptionsResult): void;
}

export interface LoadOptionsFunction {
  (keyword: string, callback: LoadOptionsCallback): void;
}

export interface SelectProps {
  className?: string;
  multi?: boolean;
  value: SelectValue | SelectValue[];
  options?: SelectOption[];
  onChange: (value: any) => any;
  placeholder?: string;
  allowCreate?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loadOptions?: LoadOptionsFunction;
}

export default class Select extends Component<SelectProps>{
}
