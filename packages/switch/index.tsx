import * as React from 'react';
import * as classnames from 'classnames';
import { SelectValue, SelectOption } from '@samoyed/types';
import { SwitchProps } from '.';
import { getOptionValue } from './utils';

interface SwatchState {
  options?: SelectOption[];
}

export default class Swtich extends React.Component<SwitchProps, SwatchState> {
  constructor(props: SwitchProps) {
    super(props);
    this.state = {
      options: props.options
    };
  }

  static getDerivedStateFromProps(nextProps: SwitchProps) {
    return {
      options: nextProps.options
    };
  }

  handleClick(opt: string) {
    const { value, multi, onChange, clearable } = this.props;
    const { options } = this.state;

    let optionsMap: { [path: string]: SelectOption } = {};
    options.forEach((o) => {
      optionsMap[getOptionValue(o)] = o;
    });

    if (!multi) {
      let v = optionsMap[opt] ? optionsMap[opt].value : optionsMap[opt];
      if (v === value && clearable) {
        onChange(null);
      } else {
        onChange(v);
      }
      return;
    }

    //multi
    if (!value || !(value as SelectValue[]).length) {
      if (typeof optionsMap[opt] !== 'undefined' && typeof optionsMap[opt].value !== 'undefined') {
        onChange([optionsMap[opt].value]);
      } else {
        onChange([opt]);
      }
      return;
    }

    let valueArray: SelectValue[] = [];

    if (Array.isArray(value)) {
      valueArray = value;
    } else if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      valueArray = [value];
    }

    let res: SelectValue[] = [];
    let found = false;
    valueArray.forEach((v: string | number | boolean) => {
      let vid = String(v);
      if (vid === opt) {
        found = true;
      } else if (typeof optionsMap[vid] !== 'undefined') {
        if (typeof optionsMap[vid].value !== 'undefined') {
          res.push(optionsMap[vid].value);
        } else {
          res.push(vid);
        }
      }
    });
    if (!found) {
      res.push(opt);
    }
    onChange(res);
  }

  render() {
    const { className, value, multi, disabled } = this.props;
    const { options } = this.state;
    let valueMap: { [path: string]: boolean } = {};
    if (multi) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          valueMap[getOptionValue(v)] = true;
        });
      }
    } else if (typeof value !== 'undefined') {
      valueMap[getOptionValue(value as SelectValue)] = true;
    }
    return (
      <div className={classnames('btn-group', className)}>
        {options.map((o) => {
          let cls = 'btn';
          let vid = getOptionValue(o);
          if (valueMap[vid]) {
            cls += (o.color ? ' active btn-' + o.color : ' active btn-success');
          } else {
            cls += ' btn-light';
          }
          if (disabled) {
            cls += ' disabled';
          }
          return <div key={vid} className={cls} onClick={disabled ? null : () => this.handleClick(vid)}>{o.label}</div>;
        })}
      </div>
    );
  }
}
