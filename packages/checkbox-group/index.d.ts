import { Component, ReactNode } from 'react';
import { Style, SelectValue, SelectOption } from '@samoyed/types';

export interface CheckboxGroupProps {
  className?: string;
  multi?: boolean;
  value: SelectValue | SelectValue[];
  options?: SelectOption[];
  onChange: (value: any) => any;
  disabled?: boolean;
}

export default class CheckboxGroup extends Component<CheckboxGroupProps>{
}
