"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
class Box extends React.Component {
    render() {
        const { children, className, innerClassName, boxRef, innerRef } = this.props;
        return (React.createElement("div", { className: classnames('s-box', className), ref: boxRef },
            React.createElement("div", { className: classnames('s-box-inner', innerClassName), ref: innerRef }, children)));
    }
}
exports.default = Box;
