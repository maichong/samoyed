import { Component, ReactNode } from 'react';
import { Style, SelectValue, SelectOption } from '@samoyed/types';

export interface SwitchProps {
  className?: string;
  multi?: boolean;
  value: SelectValue | SelectValue[];
  options?: SelectOption[];
  onChange: (value: any) => any;
  disabled?: boolean;
}

export default class Switch extends Component<SwitchProps>{
}
