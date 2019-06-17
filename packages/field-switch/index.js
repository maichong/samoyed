"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowEqualWithout = require("shallow-equal-without");
const tr = require("grackle");
const switch_1 = require("@samoyed/switch");
const _ = require("lodash");
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
        if (multi) {
            if (!_.isArray(value)) {
                value = [value];
            }
            value = _.filter(value, (v) => typeof v !== 'undefined' && v !== null);
        }
        className += ' select-field';
        if (error) {
            className += ' is-invalid';
            help = error;
        }
        let helpElement = help ? React.createElement("small", { className: error ? 'form-text invalid-feedback' : 'form-text text-muted' }, help) : null;
        let inputElement = React.createElement(switch_1.default, { clearable: !disabled, value: value, multi: multi, disabled: disabled, options: this.state.options, onChange: onChange });
        return (React.createElement("div", { className: className },
            label ? React.createElement("label", { className: "col-form-label" }, label) : null,
            inputElement,
            helpElement));
    }
}
exports.default = SwitchField;
