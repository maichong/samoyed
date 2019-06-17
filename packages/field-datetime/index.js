"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const shallowEqualWithout = require("shallow-equal-without");
const DateTime = require("react-datetime");
const moment = require("moment");
class DatetimeField extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !shallowEqualWithout(nextProps, this.props, 'record');
    }
    render() {
        let { className, value, disabled, error, onChange, help, label, format, dateFormat, timeFormat } = this.props;
        let fmt = format || 'YYYY-MM-DD HH:mm:ss';
        let dateFmt = dateFormat || 'YYYY-MM-DD';
        let timeFmt = timeFormat || 'HH:mm:ss';
        let valueString = '';
        if (value) {
            valueString = moment(value).format(fmt);
        }
        let inputElement;
        if (disabled) {
            inputElement = React.createElement("input", { type: "text", className: "form-control", disabled: true, value: valueString });
        }
        else {
            inputElement = React.createElement(DateTime, { locale: this.props.locale.toLowerCase(), value: valueString || value, dateFormat: dateFmt, timeFormat: timeFmt, onChange: (v) => {
                    v = v || '';
                    v = v.format ? v.format() : '';
                    onChange(v);
                } });
        }
        return (React.createElement("div", { className: classnames('s-component s-field s-field-datetime form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            inputElement,
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
DatetimeField.defaultProps = {
    locale: 'zh-CN'
};
exports.default = DatetimeField;
