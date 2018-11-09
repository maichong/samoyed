import * as React from 'react';
import { SelectValue, SelectOption } from '@samoyed/types';
import { SwitchProps, SwatchState } from '..';
import { getOptionValue } from './utils';

export default class Swtich extends React.Component<SwitchProps, SwatchState> {
  constructor(props: SwitchProps) {
    super(props);
    this.state = {
      options: props.options
    };
  }

  componentWillMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(props: SwitchProps) {
    this.init(props);
  }

  init(props: SwitchProps) {
    this.setState({ options: props.options });
  }

  handleClick(opt: string) {
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
    valueArray.forEach((v: string | number | boolean) => {
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
    const { value, multi, disabled } = this.props;
    const { options } = this.state;
    let valueMap: { [path: string]: boolean } = {};
    if (multi) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          valueMap[getOptionValue(v)] = true;
        });
      }
    } else if (value !== undefined) {
      valueMap[getOptionValue(value as SelectValue)] = true;
    }
    return (
      <div className="btn-group">
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
