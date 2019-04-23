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
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
const Hammer = require('react-hammerjs').default;
console.log('Hammer', Hammer);
class Drawer extends React.Component {
    constructor() {
        super(...arguments);
        this.drawerHeight = 0;
        this.drawerWidth = 0;
        this.handleDrawerRef = (r) => {
            let init = !this.drawerRef;
            this.drawerRef = r;
            if (!r)
                return;
            this.drawerHeight = r.children[0].clientHeight;
            this.drawerWidth = r.children[0].clientWidth;
            if (init && this.props.mode === 'slide') {
                this.forceUpdate();
            }
        };
        this.handlePanStart = (e) => {
            console.log('handlePanStart', e);
        };
        this.handlePan = (e) => {
            console.log('handlePan', e);
        };
        this.handlePanEnd = (e) => {
            console.log('handlePanEnd', e);
        };
    }
    getStyles() {
        const { mode, show, placement } = this.props;
        let drawer = {};
        let contianer = {};
        if (mode === 'slide') {
            let drawerPos = { x: 0, y: 0 };
            let containerPos = { x: 0, y: 0 };
            let drawerHeight = this.drawerHeight || 800;
            let drawerWidth = this.drawerWidth || 800;
            if (show) {
                switch (placement) {
                    case 'top':
                        containerPos.y = drawerHeight;
                        break;
                    case 'bottom':
                        containerPos.y = -drawerHeight;
                        break;
                    case 'left':
                        containerPos.x = drawerWidth;
                        break;
                    case 'right':
                        containerPos.x = -drawerWidth;
                        break;
                }
            }
            else {
                switch (placement) {
                    case 'top':
                        drawerPos.y = -drawerHeight;
                        break;
                    case 'bottom':
                        drawerPos.y = drawerHeight;
                        break;
                    case 'left':
                        drawerPos.x = -drawerWidth;
                        break;
                    case 'right':
                        drawerPos.x = drawerWidth;
                        break;
                }
            }
            contianer.transform = `translate(${containerPos.x}px, ${containerPos.y}px)`;
            drawer.transform = `translate(${drawerPos.x}px, ${drawerPos.y}px)`;
        }
        return { contianer, drawer };
    }
    render() {
        let _a = this.props, { children, className, bodyClassName, drawer, placement, draggable, mode, containerClassName, drawerClassName, show, onShow, onHide } = _a, others = __rest(_a, ["children", "className", "bodyClassName", "drawer", "placement", "draggable", "mode", "containerClassName", "drawerClassName", "show", "onShow", "onHide"]);
        mode = mode || 'cover';
        if (typeof drawer === 'function') {
            drawer = drawer();
        }
        draggable = typeof draggable === 'undefined' ? app_1.default.is.touch : draggable;
        console.log('draggable', draggable);
        let styles = this.getStyles();
        let el = (React.createElement("div", Object.assign({ className: classnames('s-component', 's-drawer', `s-drawer-${placement}`, `s-drawer-${mode}`, {
                's-draggable': draggable,
                's-show': show
            }, className) }, others),
            React.createElement("div", { ref: this.handleDrawerRef, className: classnames('s-drawer-drawer', drawerClassName), style: styles.drawer }, drawer),
            show && React.createElement("div", { className: "s-drawer-mask", onClick: onHide, style: styles.contianer }),
            React.createElement("div", { className: classnames('s-drawer-contianer s-full', containerClassName), style: styles.contianer }, children)));
        if (draggable) {
            el = React.createElement(Hammer, { onPanStart: this.handlePanStart, onPan: this.handlePan, onPanEnd: this.handlePanEnd }, el);
        }
        return el;
    }
}
exports.default = Drawer;
