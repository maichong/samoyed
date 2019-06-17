"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const shallowEqualWithout = require("shallow-equal-without");
const checkbox_1 = require("@samoyed/checkbox");
class CheckboxField extends React.Component {
    shouldComponentUpdate(props) {
        return !shallowEqualWithout(props, this.props, 'record');
    }
    render() {
        let { className, label, help, value, error, disabled, multi, onChange } = this.props;
        let inputElement = (React.createElement(checkbox_1.default, { radio: !multi, label: label, value: value, onChange: onChange, disabled: disabled }));
        return (React.createElement("div", { className: classnames('s-component s-field s-field-checkbox form-group', className, { 'is-invalid': error }) },
            inputElement,
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
exports.default = CheckboxField;
