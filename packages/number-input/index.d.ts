import * as React from 'react';
import { FieldProps } from '@samoyed/types';

export interface NumberInputProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'number';
  /**
   * input 元素ref
   */
  inputRef?: (instance: any | null) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (v: number) => any;
}

export default class NumberInput extends React.Component<NumberInputProps> {
}
