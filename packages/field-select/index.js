"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowEqualWithout = require("shallow-equal-without");
const _ = require("lodash");
const classnames = require("classnames");
const select_1 = require("@samoyed/select");
class SelectField extends React.Component {
    shouldComponentUpdate(props) {
        return !shallowEqualWithout(props, this.props, 'record');
    }
    render() {
        let { className, value, disabled, error, onChange, help, multi, label, options } = this.props;
        let inputClassName = classnames('', { 'is-invalid': error });
        if (multi) {
            if (!_.isArray(value)) {
                value = [value];
            }
            value = _.filter(value, (v) => typeof v !== 'undefined' && v !== null);
        }
        return (React.createElement("div", { className: classnames('s-component s-field s-field-select form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            React.createElement(select_1.default, { className: inputClassName, clearable: !disabled, value: value, multi: multi, disabled: disabled, options: options, onChange: onChange }),
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
exports.default = SelectField;
