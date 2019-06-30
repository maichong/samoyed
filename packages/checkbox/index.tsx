import * as React from 'react';
import Icon from '@samoyed/icon';
import { CheckboxProps } from '.';

export default function Checkbox(props: CheckboxProps) {
  let {
    className = '',
    radio,
    value,
    disabled,
    label,
    onChange
  } = props;
  className = `checkbox ${className}`;

  if (disabled) {
    className += ' disabled';
  }
  if (value) {
    className += ' checked';
  }

  let icon = 'square-o';
  if (radio) {
    if (value) {
      icon = 'checkbox-square';
    } else {
      icon = 'checkbox-square-blank';
    }
  } else {
    if (value) {
      icon = 'checkbox';
    } else {
      icon = 'checkbox-blank';
    }
  }

  function handleChange() {
    onChange(!value);
  }

  return (
    <label className={className} onClick={(disabled || !onChange) ? null : handleChange}>
      <Icon name={icon} />
      {label}
    </label>
  );
}
