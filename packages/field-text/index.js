"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const shallowEqualWithout = require("shallow-equal-without");
class TextField extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = (event) => {
            this.props.onChange(event.target.value);
        };
    }
    shouldComponentUpdate(nextProps) {
        return !shallowEqualWithout(nextProps, this.props, 'record');
    }
    render() {
        let { className, label, help, value, error, disabled, placeholder, addonAfter, addonBefore, multiLine } = this.props;
        let inputClassName = classnames('form-control', { 'is-invalid': error });
        let inputElement;
        if (multiLine) {
            inputElement = (React.createElement("textarea", { className: inputClassName, placeholder: placeholder, onChange: this.handleChange, disabled: disabled, value: value }));
        }
        else {
            inputElement = (React.createElement("input", { type: "text", className: inputClassName, placeholder: placeholder, onChange: this.handleChange, value: value, disabled: disabled }));
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
        }
        return (React.createElement("div", { className: classnames('s-component s-field s-field-text form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            inputElement,
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
exports.default = TextField;
