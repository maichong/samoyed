"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
class CardLayout extends React.Component {
    render() {
        const { className, elRef, children } = this.props;
        console.log('children', children);
        return (React.createElement("div", { className: classnames('s-layout-card', className), ref: elRef }, children));
    }
}
exports.default = CardLayout;
