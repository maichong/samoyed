import React, { Component } from 'react';
import { SelectValue } from '@samoyed/types';
import { SwitchProps } from '..';

export default class Swtich extends Component<SwitchProps> {
  handleChange = (v: SelectValue) => {
    const { onChange, value, multi } = this.props;
    if (onChange) {
      if (!multi) {
        onChange(v);
      } else {
        let index = (value as SelectValue[]).indexOf(v);
        if (index >= 0) {
          (value as SelectValue[]).splice(index, 1);
        } else {
          (value as SelectValue[]).push(v);
        }
        onChange(value);
      }
    }
  }

  checkSelect = (v: SelectValue) => {
    const { value } = this.props;
    return v === value || (value as SelectValue[]).indexOf(v) >= 0;
  }

  render() {
    const {
      className,
      options,
      disabled
    } = this.props;
    let tclass = 'btn-group ' + className;
    if (disabled) {
      tclass += ' disabled';
    }
    return (
      <div className={tclass} role="group">
        {
          (options || []).forEach((item) => <button
            type="button"
            className={
              'btn btn-' +
              (this.checkSelect(item.value) ? (item.style || 'primary') : 'default')
              + (disabled ? ' disabled' : '')
            }
          >
            {item.label || ''}
          </button>)
        }
        {}
      </div>
    );
  }
}
