import React, { Component } from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';
import Checkbox from '@samoyed/checkbox';
import { getOptionValue } from './utils';
import { CheckboxGroupProps, CheckboxGroupState } from '..';

export default class CheckboxGroup extends Component<CheckboxGroupProps, CheckboxGroupState> {
  constructor(props: CheckboxGroupProps) {
    super(props);
    this.state = {
      options: props.options
    };
  }

  componentWillMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props: CheckboxGroupProps) {
    this.init(props);
  }

  init(props: CheckboxGroupProps) {
    this.setState({ options: props.options });
  }

  handleCheck(opt: string) {
    const { value, multi, onChange } = this.props;
    const { options } = this.state;

    let optionsMap: { [path: string]: SelectOption } = {};
    options.forEach((o) => {
      optionsMap[getOptionValue(o)] = o;
    });

    if (!multi) {
      if (optionsMap[opt]) {
        onChange(optionsMap[opt].value);
      } else {
        onChange(opt);
      }
      return;
    }

    //multi
    if (!value || !(value as SelectValue[]).length) {
      if (optionsMap[opt] !== undefined && optionsMap[opt].value !== undefined) {
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
      } else if (optionsMap[vid] !== undefined) {
        if (optionsMap[vid].value !== undefined) {
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
      <div>{
        options.map((opt: SelectOption) => {
          let vid: string = getOptionValue(opt);
          let className = '';
          if (opt.style) {
            className = 'text-' + opt.style;
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
