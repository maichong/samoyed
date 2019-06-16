import * as React from 'react';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import NumberInput from '@samoyed/number-input';
import { NumberFieldProps } from '.';

export default class NumberField extends React.Component<NumberFieldProps> {
  shouldComponentUpdate(nextProps: NumberFieldProps): boolean {
    return !shallowEqualWithout(nextProps, this.props, 'record');
  }

  render() {
    let {
      className, label, help, value, error, disabled, placeholder,
      addonAfter, addonBefore, max, min, format, onChange
    } = this.props;

    let inputElement = (<NumberInput
      type="text"
      className={classnames('form-control', { 'is-invalid': error })}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      value={value}
      min={min}
      max={max}
      format={format}
    />);

    let addonAfterEl = addonAfter ?
      <div className="input-group-append">
        <span className="input-group-text">{addonAfter}</span>
      </div> : null;

    let addonBeforeEl = addonBefore ?
      <div className="input-group-prepend">
        <span className="input-group-text">{addonBefore}</span>
      </div> : null;

    if (addonAfterEl || addonBeforeEl) {
      inputElement = <div className="input-group">{addonBeforeEl}{inputElement}{addonAfterEl}</div>;
    }

    return (
      <div className={classnames('s-component s-field s-field-number form-group', className, { 'is-invalid': error })}>
        {label && <label>{label}</label>}
        {inputElement}
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
