"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
class CardLayout extends React.Component {
    render() {
        const { className, elRef, children, active } = this.props;
        let elements = children;
        if (!Array.isArray(elements)) {
            console.warn('Card layout children must be node array!');
            elements = elements ? [elements] : [];
        }
        let actived = elements[active || 0] || elements[0];
        return (React.createElement("div", { className: classnames('s-layout-card', className), ref: elRef }, actived));
    }
}
app_1.default.views.CardLayout = CardLayout;
exports.default = CardLayout;
