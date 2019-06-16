"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const numeral = require("numeral");
class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (event) => {
            let display = event.target.value;
            this.setState({ display });
        };
        this.handleBlur = () => {
            const { min, max, format } = this.props;
            let value = this.state.display;
            let unfomarted = numeral(value).value();
            if (Number.isNaN(unfomarted)) {
                unfomarted = 0;
            }
            if (typeof min === 'number' && min > unfomarted) {
                unfomarted = min;
            }
            if (typeof max === 'number' && max < unfomarted) {
                unfomarted = max;
            }
            if (format) {
                this.setState({ display: numeral(unfomarted).format(format) });
            }
            else {
                this.setState({ display: String(unfomarted || '') });
            }
            if (unfomarted !== this.props.value) {
                this.props.onChange(unfomarted);
            }
        };
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.value !== prevState._value) {
            return {
                _value: nextProps.value,
                display: numeral(nextProps.value).format(nextProps.format)
            };
        }
        return null;
    }
    render() {
        let { className, type = 'text', style, inputRef, placeholder, disabled } = this.props;
        return (React.createElement("input", { className: className, type: type, style: style, ref: inputRef, placeholder: placeholder, disabled: disabled, value: this.state.display, onChange: this.handleChange, onBlur: this.handleBlur }));
    }
}
exports.default = NumberInput;
