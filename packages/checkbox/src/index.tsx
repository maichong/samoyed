import React, { Component } from 'react';
import Icon from '@samoyed/icon';
import { CheckboxProps } from '..';

export default class Checkbox extends Component<CheckboxProps> {
  handleChange = () => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange(!value);
    }
  };

  render() {
    let {
      className = '',
      radio,
      value,
      disabled,
      label
    } = this.props;
    className = 'checkbox ' + className;
    if (disabled) {
      className += ' disabled';
    }
    if (value) {
      className += ' checked';
    }
    let icon = 'square-o';
    if (radio) {
      if (value) {
        icon = 'check-circle';
      } else {
        icon = 'circle-o';
      }
    } else if (value) {
      icon = 'check-square';
    } else {
      // icon = 'square-o';
    }
    return (
      <label className={className} onClick={disabled ? null : this.handleChange}>
        <Icon name={icon} />
        {label}
      </label>
    );
  }
}
