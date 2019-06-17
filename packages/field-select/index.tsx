import * as React from 'react';
import * as shallowEqualWithout from 'shallow-equal-without';
import * as tr from 'grackle';
import Select from '@samoyed/select';
import * as _ from 'lodash';
import { SelectOption } from '@samoyed/types';
import * as classnames from 'classnames';
import { SelectFieldProps } from '.';

interface SelectFieldState {
  _options: SelectOption[];
  options: SelectOption[];
}

function filter(options?: SelectOption[]): SelectOption[] {
  if (!options || !options.length) {
    return [];
  }
  let res: SelectOption[] = [];
  _.forEach(options, (opt: SelectOption) => {
    opt.label = tr(opt.label);
    res.push(opt);
  });
  return res;
}

export default class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  constructor(props: SelectFieldProps) {
    super(props);
    this.state = {
      _options: props.options,
      options: filter(props.options)
    };
  }

  static getDerivedStateFromProps(nextProps: SelectFieldProps, prevState: SelectFieldState) {
    if (nextProps.options !== prevState._options) {
      return {
        _options: nextProps.options,
        options: filter(nextProps.options)
      };
    }
    return null;
  }

  shouldComponentUpdate(props: SelectFieldProps, state: SelectFieldState) {
    return !shallowEqualWithout(props, this.props, 'record') || !shallowEqualWithout(state, this.state);
  }

  render() {
    let {
      className, value, disabled, error, onChange, help, multi, label
    } = this.props;
    let inputClassName = classnames('', { 'is-invalid': error });
    if (multi) {
      if (!_.isArray(value)) {
        value = [value];
      }
      value = _.filter(value, (v) => typeof v !== 'undefined' && v !== null);
    }
    return (
      <div className={classnames('s-component s-field s-field-select form-group', className, { 'is-invalid': error })}>
        {label && <label>{label}</label>}
        <Select
          className={inputClassName}
          clearable={!disabled}
          value={value}
          multi={multi}
          disabled={disabled}
          options={this.state.options}
          onChange={onChange}
        />
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
