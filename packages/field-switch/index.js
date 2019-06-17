"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowEqualWithout = require("shallow-equal-without");
const tr = require("grackle");
const switch_1 = require("@samoyed/switch");
const _ = require("lodash");
const classnames = require("classnames");
function filter(options) {
    if (!options || !options.length) {
        return [];
    }
    let res = [];
    _.forEach(options, (opt) => {
        opt.label = tr(opt.label);
        res.push(opt);
    });
    return res;
}
class SwitchField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: filter(props.options)
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let state = {
            options: nextProps.options
        };
        if (nextProps.options !== prevState.options) {
            state.options = filter(nextProps.options);
        }
        return state;
    }
    shouldComponentUpdate(props, state) {
        return !shallowEqualWithout(props, this.props, 'record') || state !== this.state;
    }
    render() {
        let { className, value, disabled, error, onChange, help, multi, label } = this.props;
        let inputClassName = classnames('form-control', { 'is-invalid': error });
        if (multi) {
            if (!_.isArray(value)) {
                value = [value];
            }
            value = _.filter(value, (v) => typeof v !== 'undefined' && v !== null);
        }
        return (React.createElement("div", { className: classnames('s-component s-field s-field-switch form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            React.createElement(switch_1.default, { className: inputClassName, clearable: !disabled, value: value, multi: multi, disabled: disabled, options: this.state.options, onChange: onChange }),
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
exports.default = SwitchField;
