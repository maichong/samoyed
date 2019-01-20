import * as React from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';
import Checkbox from '@samoyed/checkbox';
import { getOptionValue } from './utils';
import { CheckboxGroupProps } from '.';

interface CheckboxGroupState {
  options?: SelectOption[];
}

export default class CheckboxGroup extends React.Component<CheckboxGroupProps, CheckboxGroupState> {
  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      options: props.options
    };
  }

  static getDerivedStateFromProps(nextProps: CheckboxGroupProps) {
    return { options: nextProps.options };
  }

  handleCheck(opt: string) {
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
    valueArray.forEach((v: SelectValue) => {
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
    const { multi, value, disabled } = this.props;
    const { options } = this.state;
    let valueMap: { [path: string]: boolean } = {};
    if (multi) {
      if (Array.isArray(value)) {
        (value as SelectValue[]).forEach((v) => {
          valueMap[String(v)] = true;
        });
      }
    } else {
      let valueString = String(value);
      valueMap[valueString] = true;
    }

    return (
      <div className="checkbox-group">
        {
          options.map((opt: SelectOption) => {
            let vid: string = getOptionValue(opt);
            let className = '';
            if (opt.color) {
              className = 'text-' + opt.color;
            }
            return (<Checkbox
              key={vid}
              className={className}
              disabled={disabled}
              radio={!multi}
              label={opt.label}
              value={valueMap[vid] === true}
              onChange={() => this.handleCheck(vid)}
            />);
          })
        }
      </div>
    );
  }
}
