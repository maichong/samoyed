import * as React from 'react';
import * as classnames from 'classnames';
import * as shallowEqualWithout from 'shallow-equal-without';
import * as DateTime from 'react-datetime';
import * as moment from 'moment';
import { DatetimeFieldProps } from '.';

export default class DatetimeField extends React.Component<DatetimeFieldProps> {

  static defaultProps = {
    locale: 'zh-CN'
  };

  shouldComponentUpdate(nextProps: DatetimeFieldProps): boolean {
    return !shallowEqualWithout(nextProps, this.props, 'record');
  }

  render() {
    let {
      className, value, disabled, error, onChange, help, label, format, dateFormat, timeFormat
    } = this.props;
    let fmt = format || 'YYYY-MM-DD HH:mm:ss';
    let dateFmt = dateFormat || 'YYYY-MM-DD';
    let timeFmt = timeFormat || 'HH:mm:ss';
    let valueString: string = '';
    if (value) {
      valueString = moment(value).format(fmt);
    }
    let inputElement;
    if (disabled) {
      inputElement = <input type="text" className="form-control" disabled value={valueString} />;
    } else {
      inputElement = <DateTime
        locale={this.props.locale.toLowerCase()}
        value={valueString || value}
        dateFormat={dateFmt}
        timeFormat={timeFmt}
        onChange={(v: any) => {
          v = v || '';
          v = (v as moment.Moment).format ? (v as moment.Moment).format() : '';
          onChange(v);
        }}
      />;
    }

    return (
      <div className={classnames('s-component s-field s-field-datetime form-group', className, { 'is-invalid': error })}>
        {label && <label>{label}</label>}
        {inputElement}
        {error && <small className="form-text invalid-feedback">{error}</small>}
        {help && <small className={classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error })}>{help}</small>}
      </div>
    );
  }
}
