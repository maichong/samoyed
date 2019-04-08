"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const checkbox_1 = require("@samoyed/checkbox");
const utils_1 = require("./utils");
class CheckboxGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props.options
        };
    }
    static getDerivedStateFromProps(nextProps) {
        return { options: nextProps.options };
    }
    handleCheck(opt) {
        const { value, multi, onChange, clearable } = this.props;
        const { options } = this.state;
        let optionsMap = {};
        options.forEach((o) => {
            optionsMap[utils_1.getOptionValue(o)] = o;
        });
        if (!multi) {
            let v = optionsMap[opt] ? optionsMap[opt].value : optionsMap[opt];
            if (v === value && clearable) {
                onChange(null);
            }
            else {
                onChange(v);
            }
            return;
        }
        if (!value || !value.length) {
            if (typeof optionsMap[opt] !== 'undefined' && typeof optionsMap[opt].value !== 'undefined') {
                onChange([optionsMap[opt].value]);
            }
            else {
                onChange([opt]);
            }
            return;
        }
        let valueArray = [];
        if (Array.isArray(value)) {
            valueArray = value;
        }
        else if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
            valueArray = [value];
        }
        let res = [];
        let found = false;
        valueArray.forEach((v) => {
            let vid = String(v);
            if (vid === opt) {
                found = true;
            }
            else if (typeof optionsMap[vid] !== 'undefined') {
                if (typeof optionsMap[vid].value !== 'undefined') {
                    res.push(optionsMap[vid].value);
                }
                else {
                    res.push(vid);
                }
            }
        });
        if (!found) {
            res.push(opt);
        }
        onChange(res);
    }
    render() {
        const { className, multi, value, disabled } = this.props;
        const { options } = this.state;
        let valueMap = {};
        if (multi) {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    valueMap[String(v)] = true;
                });
            }
        }
        else {
            let valueString = String(value);
            valueMap[valueString] = true;
        }
        return (React.createElement("div", { className: classnames('checkbox-group', className) }, options.map((opt) => {
            let vid = utils_1.getOptionValue(opt);
            let className = '';
            if (opt.color) {
                className = 'text-' + opt.color;
            }
            return (React.createElement(checkbox_1.default, { key: vid, className: className, disabled: disabled, radio: !multi, label: opt.label, value: valueMap[vid] === true, onChange: () => this.handleCheck(vid) }));
        })));
    }
}
exports.default = CheckboxGroup;
