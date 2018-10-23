import { Component, ReactNode } from 'react';
import { Style, SelectValue, SelectOption } from '@samoyed/types';

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
