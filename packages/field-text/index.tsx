import * as React from 'react';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import { TextFieldProps } from '.';

export default class TextField extends React.Component<TextFieldProps> {
  shouldComponentUpdate(nextProps: TextFieldProps): boolean {
    return !shallowEqualWithout(nextProps, this.props, 'record');
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    this.props.onChange(event.target.value);
  };

  render() {
    let {
      className, label, help, value, error, disabled, placeholder,
      addonAfter, addonBefore, multiLine
    } = this.props;

    let inputClassName = classnames('form-control', { 'is-invalid': error });
    let inputElement;
    if (multiLine) {
      inputElement = (<textarea
        className={inputClassName}
        placeholder={placeholder}
        onChange={this.handleChange}
        disabled={disabled}
        value={value}
      />);
    } else {
      inputElement = (<input
        type="text"
        className={inputClassName}
        placeholder={placeholder}
        onChange={this.handleChange}
        value={value}
        disabled={disabled}
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
    }

    return (
      <div className={classnames('s-component s-field s-field-text form-group', className, { 'is-invalid': error })}>
        {label && <label>{label}</label>}
        {inputElement}
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
