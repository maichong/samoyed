import { Component, ReactNode } from 'react';

export interface CheckboxProps {
  className?: string,
  radio?: boolean,
  value: boolean,
  disabled?: boolean,
  label?: string,
  onChange?: Function,
}

export default class Checkbox extends Component<CheckboxProps>{
}
