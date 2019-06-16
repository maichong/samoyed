"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const shallowEqualWithout = require("shallow-equal-without");
const number_input_1 = require("@samoyed/number-input");
class NumberField extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !shallowEqualWithout(nextProps, this.props, 'record');
    }
    render() {
        let { className, label, help, value, error, disabled, placeholder, addonAfter, addonBefore, max, min, format, onChange } = this.props;
        let inputElement = (React.createElement(number_input_1.default, { type: "text", className: classnames('form-control', { 'is-invalid': error }), placeholder: placeholder, disabled: disabled, onChange: onChange, value: value, min: min, max: max, format: format }));
        let addonAfterEl = addonAfter ?
            React.createElement("div", { className: "input-group-append" },
                React.createElement("span", { className: "input-group-text" }, addonAfter)) : null;
        let addonBeforeEl = addonBefore ?
            React.createElement("div", { className: "input-group-prepend" },
                React.createElement("span", { className: "input-group-text" }, addonBefore)) : null;
        if (addonAfterEl || addonBeforeEl) {
            inputElement = React.createElement("div", { className: "input-group" },
                addonBeforeEl,
                inputElement,
                addonAfterEl);
        }
        return (React.createElement("div", { className: classnames('s-component s-field s-field-number form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            inputElement,
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
exports.default = NumberField;
