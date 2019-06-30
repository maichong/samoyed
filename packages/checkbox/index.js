"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const icon_1 = require("@samoyed/icon");
function Checkbox(props) {
    let { className = '', radio, value, disabled, label, onChange } = props;
    className = `checkbox ${className}`;
    if (disabled) {
        className += ' disabled';
    }
    if (value) {
        className += ' checked';
    }
    let icon = 'square-o';
    if (radio) {
        if (value) {
            icon = 'checkbox-square';
        }
        else {
            icon = 'checkbox-square-blank';
        }
    }
    else {
        if (value) {
            icon = 'checkbox';
        }
        else {
            icon = 'checkbox-blank';
        }
    }
    function handleChange() {
        onChange(!value);
    }
    return (React.createElement("label", { className: className, onClick: (disabled || !onChange) ? null : handleChange },
        React.createElement(icon_1.default, { name: icon }),
        label));
}
exports.default = Checkbox;
