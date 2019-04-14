"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const utils_1 = require("./utils");
class Swtich extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: props.options
        };
    }
    static getDerivedStateFromProps(nextProps) {
        return {
            options: nextProps.options
        };
    }
    handleClick(opt) {
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
        const { className, value, multi, disabled } = this.props;
        const { options } = this.state;
        let valueMap = {};
        if (multi) {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    valueMap[utils_1.getOptionValue(v)] = true;
                });
            }
        }
        else if (typeof value !== 'undefined') {
            valueMap[utils_1.getOptionValue(value)] = true;
        }
        return (React.createElement("div", { className: classnames('btn-group', className) }, options.map((o) => {
            let cls = 'btn';
            let vid = utils_1.getOptionValue(o);
            if (valueMap[vid]) {
                cls += (o.color ? ` active btn-${o.color}` : ' active btn-success');
            }
            else {
                cls += ' btn-light';
            }
            if (disabled) {
                cls += ' disabled';
            }
            return React.createElement("div", { key: vid, className: cls, onClick: disabled ? null : () => this.handleClick(vid) }, o.label);
        })));
    }
}
exports.default = Swtich;
