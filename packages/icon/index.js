"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Icon extends React.Component {
    render() {
        const { className, name } = this.props;
        let cls = `s-icon fa fa-${name}`;
        if (className) {
            cls += ` ${className}`;
        }
        return React.createElement("i", { className: cls });
    }
}
exports.default = Icon;
