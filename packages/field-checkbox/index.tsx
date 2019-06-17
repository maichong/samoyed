import * as React from 'react';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import Checkbox from '@samoyed/checkbox';
import { CheckboxFieldProps } from '.';

export default class CheckboxField extends React.Component<CheckboxFieldProps> {
  shouldComponentUpdate(props: CheckboxFieldProps) {
    return !shallowEqualWithout(props, this.props, 'record', 'onChange', 'model');
  }

  handleChange = (checked: boolean) => {
    if (this.props.onChange) {
      this.props.onChange(checked);
    }
  };

  render() {
    let {
      className, label, help, value, error, disabled, radio
    } = this.props;
    let inputElement = (<Checkbox
      radio={!!radio}
      label={label}
      value={value}
      onChange={this.handleChange}
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
