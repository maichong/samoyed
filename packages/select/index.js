"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const tr = require("grackle");
const classnames = require("classnames");
const react_select_1 = require("react-select");
const Async_1 = require("react-select/lib/Async");
const Creatable_1 = require("react-select/lib/Creatable");
const AsyncCreatable_1 = require("react-select/lib/AsyncCreatable");
function init(value, options, oldLabelMap) {
    let optionsMap = {};
    let valueMap = {};
    let labelMap = {};
    let values = [];
    if (Array.isArray(value)) {
        _.forEach(value, (v) => {
            valueMap[String(v)] = true;
            values.push(String(v));
            labelMap[String(v)] = oldLabelMap[String(v)];
        });
    }
    else {
        valueMap[String(value)] = true;
        values.push(String(value));
        labelMap[String(value)] = oldLabelMap[String(value)];
    }
    let res = _.map(options || [], (opt) => {
        if (typeof opt.color === 'string') {
            opt = _.omit(opt, 'color');
        }
        let vKey = String(opt.value);
        optionsMap[vKey] = opt;
        if (valueMap[vKey]) {
            delete valueMap[vKey];
        }
        return opt;
    });
    if (_.size(valueMap)) {
        _.keys(valueMap).forEach((v) => {
            if (optionsMap[v]) {
                res.push(optionsMap[v]);
            }
        });
    }
    values.forEach((v) => {
        if (optionsMap[v]) {
            labelMap[v] = optionsMap[v].label;
        }
    });
    return { _value: value, options: res, optionsMap, labelMap };
}
function processValue(multi, value, selectState) {
    let optionsMap = selectState.optionsMap || {};
    let options = selectState.options || {};
    function processOne(v) {
        if (optionsMap[String(v)]) {
            return optionsMap[String(v)];
        }
        let item = _.find(options, (opt) => opt.value === v);
        if (item) {
            return item;
        }
        return { value: v, label: selectState.labelMap[v] || v };
    }
    if (multi) {
        if (!value || !value.length) {
            return [];
        }
        return _.map(value, processOne);
    }
    return processOne(value);
}
class Select extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = (keyword, callback) => {
            this.props.loadOptions(keyword, (options) => {
                if (_.size(this.state.labelMap)) {
                    let values = [];
                    options.forEach((opt) => values.push(String(opt.value)));
                    let others = [];
                    _.forEach(this.state.labelMap, (label, value) => {
                        if (values.indexOf(value) < 0) {
                            others.push({ label, value });
                        }
                    });
                    if (others.length) {
                        options = options.concat(others);
                    }
                }
                callback(options);
            });
        };
        this.handleChange = (vOpt) => {
            let { optionsMap } = this.state;
            let newValue = '';
            let newVopt = null;
            if (vOpt) {
                if (Array.isArray(vOpt)) {
                    let arr = [];
                    let arrVopt = [];
                    vOpt.forEach((opt) => {
                        if (opt.label !== String(opt.value)) {
                            optionsMap[String(opt.value)] = opt;
                        }
                        arr.push(opt.value);
                        arrVopt.push(opt);
                    });
                    newValue = arr;
                    newVopt = arrVopt;
                }
                else {
                    optionsMap[String(vOpt.value)] = vOpt;
                    newValue = vOpt.value;
                    newVopt = vOpt;
                }
            }
            if (this.props.onChange) {
                this.props.onChange(newValue);
                return;
            }
            this.setState({
                optionsMap,
                value: newVopt
            });
        };
        let data = init(props.value, props.options || props.defaultOptions, {});
        this.state = {
            _value: props.value,
            options: data.options,
            optionsMap: data.optionsMap,
            labelMap: data.labelMap,
            value: processValue(props.multi, props.value, data)
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let state = {
            _value: nextProps.value
        };
        if (nextProps.options !== prevState.options || nextProps.value !== prevState._value) {
            let data = init(nextProps.value, nextProps.options || nextProps.defaultOptions, prevState.labelMap);
            state.options = data.options;
            state.optionsMap = data.optionsMap;
            state.labelMap = data.labelMap;
            state.value = processValue(nextProps.multi, nextProps.value, data);
        }
        return state;
    }
    render() {
        let _a = this.props, { className, onChange, value, options, multi, allowCreate, disabled, placeholder, clearable, loadOptions } = _a, others = __rest(_a, ["className", "onChange", "value", "options", "multi", "allowCreate", "disabled", "placeholder", "clearable", "loadOptions"]);
        let View;
        let props = {
            className: classnames('select', className),
            classNamePrefix: 'select',
            isMulti: multi,
            isClearable: clearable,
            isDisabled: disabled,
            placeholder: placeholder || tr('Select...'),
            onChange: this.handleChange,
            value: this.state.value,
            options: this.state.options,
            loadOptions: this.handleSearch
        };
        if (allowCreate) {
            View = Creatable_1.default;
            if (loadOptions) {
                View = AsyncCreatable_1.default;
            }
            props.isValidNewOption = (inputValue, selectValue, selectOptions) => {
                return inputValue && !selectOptions
                    .map(option => option.label)
                    .includes(inputValue);
            };
        }
        else if (loadOptions) {
            View = Async_1.default;
        }
        else {
            View = react_select_1.default;
        }
        return React.createElement(View, _.assign(others, props));
    }
}
exports.default = Select;
