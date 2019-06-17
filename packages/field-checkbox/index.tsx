import * as React from 'react';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import Checkbox from '@samoyed/checkbox';
import { CheckboxFieldProps } from '.';

export default class CheckboxField extends React.Component<CheckboxFieldProps> {
  shouldComponentUpdate(props: CheckboxFieldProps) {
    return !shallowEqualWithout(props, this.props, 'record');
  }

  render() {
    let {
      className, label, help, value, error, disabled, multi, onChange
    } = this.props;
    let inputElement = (<Checkbox
      radio={!multi}
      label={label}
      value={value}
      onChange={onChange}
      disabled={disabled}
    />);
    return (
      <div className={classnames('s-component s-field s-field-checkbox form-group', className, { 'is-invalid': error })}>
        {inputElement}
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
