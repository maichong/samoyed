import * as React from 'react';
import * as shallowEqualWithout from 'shallow-equal-without';
import * as _ from 'lodash';
import * as classnames from 'classnames';
import Select from '@samoyed/select';
import { SelectFieldProps } from '.';

export default class SelectField extends React.Component<SelectFieldProps> {
  shouldComponentUpdate(props: SelectFieldProps) {
    return !shallowEqualWithout(props, this.props, 'record');
  }

  render() {
    let {
      className, value, disabled, error, onChange, help, multi, label, options
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
          options={options}
          onChange={onChange}
        />
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
