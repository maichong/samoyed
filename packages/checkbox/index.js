"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const icon_1 = require("@samoyed/icon");
class Checkbox extends React.Component {
    constructor() {
        super(...arguments);
        this.handleChange = () => {
            const { onChange, value } = this.props;
            if (onChange) {
                onChange(!value);
            }
        };
    }
    render() {
        let { className = '', radio, value, disabled, label } = this.props;
        className = 'checkbox ' + className;
        if (disabled) {
            className += ' disabled';
        }
        if (value) {
            className += ' checked';
        }
        let icon = 'square-o';
        if (radio) {
            if (value) {
                icon = 'check-circle';
            }
            else {
                icon = 'circle-o';
            }
        }
        else if (value) {
            icon = 'check-square';
        }
        else {
        }
        return (React.createElement("label", { className: className, onClick: disabled ? null : this.handleChange },
            React.createElement(icon_1.default, { name: icon }),
            label));
    }
}
exports.default = Checkbox;
