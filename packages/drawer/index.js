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
const box_1 = require("@samoyed/box");
class Drawer extends React.Component {
    constructor() {
        super(...arguments);
        this.containerRef = null;
        this.drawerHeight = 0;
        this.drawerWidth = 0;
        this.dragging = false;
        this._styles = {};
        this.placementDirection = {
            left: true,
            right: false,
            top: true,
            bottom: false
        };
        this.handelDrawerResize = (rect) => {
            let changed = false;
            if (rect.height !== this.drawerHeight) {
                this.drawerHeight = rect.height;
                changed = true;
            }
            if (rect.width !== this.drawerWidth) {
                this.drawerWidth = rect.width;
                changed = true;
            }
            if (changed) {
                this.styles = this.getStyles();
                this.updateStyles();
            }
        };
        this.handleBodyRef = (r) => {
            this.bodyRef = r;
            if (this.props.bodyRef) {
                this.props.bodyRef(r);
            }
        };
        this.handleDrawerRef = (r) => {
            let init = !this.drawerRef;
            this.drawerRef = r;
            const drawerProps = this.props.drawerProps || {};
            if (drawerProps.elRef) {
                drawerProps.elRef(r);
            }
            if (!r)
                return;
            if (init) {
                this.styles = this.getStyles();
            }
            this._styles.drawer = null;
            this.updateStyles();
        };
        this.handleContainerRef = (r) => {
            this.containerRef = r;
            const containerProps = this.props.containerProps || {};
            if (containerProps.elRef) {
                containerProps.elRef(r);
            }
            if (!r)
                return;
            this._styles.container = null;
            this.updateStyles();
        };
        this.handleMaskRef = (r) => {
            this.maskRef = r;
            if (!r)
                return;
            this._styles.maskDisplay = null;
            this._styles.maskOpacity = null;
            this.updateStyles();
        };
        this.handleStart = (e) => {
            if (e.touches.length > 1 || !this.drawerRef || !this.bodyRef)
                return;
            let { draggable, show, placement, onShow, onHide, dragBorderSize } = this.props;
            draggable = typeof draggable === 'undefined' ? app_1.default.is.touch : draggable;
            if (!draggable)
                return;
            let { clientX: x, clientY: y } = e.touches[0];
            if (!show) {
                if (!onShow)
                    return;
                if (dragBorderSize) {
                    switch (placement) {
                        case 'left':
                            if (x > dragBorderSize)
                                return;
                            break;
                        case 'top':
                            if (y > dragBorderSize)
                                return;
                            break;
                        case 'right':
                            if ((window.innerWidth - x) > dragBorderSize)
                                return;
                            break;
                        case 'bottom':
                            if ((window.innerHeight - y) > dragBorderSize)
                                return;
                            break;
                    }
                }
            }
            else {
                if (!onHide)
                    return;
            }
            let pos = { x, y };
            this.startPos = pos;
            this.lastPos = pos;
            this.flickStartPos = pos;
            this.dragging = true;
            this.draggingDirection = true;
            this.draggingLock = null;
            this.bodyRef.classList.add('s-dragging');
        };
        this.handleMove = (e) => {
            if (!this.dragging || this.draggingLock === false)
                return;
            let { startPos, lastPos, props } = this;
            let { show, placement, mode, directionLockThreshold } = props;
            let { clientX: x, clientY: y } = e.touches[0];
            let pos = { x, y };
            let diff = 0;
            let maskOpacity = 0;
            let key;
            let lockKey;
            let value = 0;
            let drawerSize = 0;
            if (placement === 'left' || placement === 'right') {
                key = 'x';
                lockKey = 'y';
                value = x;
                drawerSize = this.drawerWidth;
            }
            else {
                key = 'y';
                lockKey = 'x';
                value = y;
                drawerSize = this.drawerHeight;
            }
            if (this.draggingLock === null) {
                if (Math.abs(value - startPos[key]) > directionLockThreshold) {
                    this.draggingLock = true;
                }
                else if (Math.abs(pos[lockKey] - startPos[lockKey]) > directionLockThreshold) {
                    this.draggingLock = false;
                }
            }
            if (!this.draggingLock || !drawerSize)
                return;
            let drawerPos = { x: 0, y: 0 };
            let containerPos = { x: 0, y: 0 };
            if (this.placementDirection[placement]) {
                if (!show) {
                    diff = Math.max(0, value - startPos[key]);
                    diff = Math.min(diff, drawerSize);
                    maskOpacity = diff / drawerSize;
                    drawerPos[key] = diff - drawerSize;
                    if (mode === 'slide') {
                        containerPos[key] = diff;
                    }
                }
                else {
                    diff = Math.min(0, value - startPos[key]);
                    diff = Math.max(diff, -drawerSize);
                    maskOpacity = 1 - (diff / -drawerSize);
                    drawerPos[key] = diff;
                    if (mode === 'slide') {
                        containerPos[key] = drawerSize + diff;
                    }
                }
            }
            else {
                if (!show) {
                    diff = Math.min(0, value - startPos[key]);
                    diff = Math.max(diff, -drawerSize);
                    maskOpacity = diff / -drawerSize;
                    drawerPos[key] = drawerSize + diff;
                    if (mode === 'slide') {
                        containerPos[key] = diff;
                    }
                }
                else {
                    diff = Math.max(0, value - startPos[key]);
                    diff = Math.min(diff, drawerSize);
                    maskOpacity = 1 - (diff / drawerSize);
                    drawerPos[key] = diff;
                    if (mode === 'slide') {
                        containerPos[key] = -drawerSize + diff;
                    }
                }
            }
            let draggingDirection = value >= lastPos[key];
            if (draggingDirection !== this.draggingDirection) {
                this.flickStartPos = pos;
                this.draggingDirection = draggingDirection;
            }
            this.lastPos = pos;
            this.styles.contianer.transform = `translate(${containerPos.x}px, ${containerPos.y}px)`;
            this.styles.drawer.transform = `translate(${drawerPos.x}px, ${drawerPos.y}px)`;
            this.styles.mask.display = 'block';
            this.styles.mask.opacity = maskOpacity;
            this.updateStyles();
        };
        this.handleEnd = (e) => {
            if (!this.dragging || !this.bodyRef)
                return;
            this.dragging = false;
            this.bodyRef.classList.remove('s-dragging');
            let { draggingDirection, draggingLock } = this;
            if (!draggingLock)
                return;
            let { show, onShow, onHide, placement } = this.props;
            if (!show && draggingDirection === this.placementDirection[placement]) {
                onShow();
                return;
            }
            else if (show && draggingDirection !== this.placementDirection[placement]) {
                onHide();
                return;
            }
            this.styles = this.getStyles();
            this.updateStyles();
        };
    }
    getStyles() {
        const { mode, show, placement } = this.props;
        let drawer = { transform: '' };
        let contianer = { transform: '' };
        let mask = { opacity: show ? 1 : 0, display: show ? 'block' : 'none' };
        if (mode === 'slide') {
            let drawerPos = { x: '0', y: '0' };
            let containerPos = { x: '0', y: '0' };
            let drawerHeight = this.drawerHeight;
            let drawerWidth = this.drawerWidth;
            if (show) {
                switch (placement) {
                    case 'top':
                        containerPos.y = `${drawerHeight}px`;
                        break;
                    case 'bottom':
                        containerPos.y = `${-drawerHeight}px`;
                        break;
                    case 'left':
                        containerPos.x = `${drawerWidth}px`;
                        break;
                    case 'right':
                        containerPos.x = `${-drawerWidth}px`;
                        break;
                }
            }
            else {
                switch (placement) {
                    case 'top':
                        drawerPos.y = '-100%';
                        break;
                    case 'bottom':
                        drawerPos.y = '100%';
                        break;
                    case 'left':
                        drawerPos.x = '-100%';
                        break;
                    case 'right':
                        drawerPos.x = '100%';
                        break;
                }
            }
            contianer.transform = `translate(${containerPos.x}, ${containerPos.y})`;
            drawer.transform = `translate(${drawerPos.x}, ${drawerPos.y})`;
        }
        return { contianer, mask, drawer };
    }
    updateStyles() {
        let { styles, containerRef, maskRef, drawerRef, _styles } = this;
        let { contianer, drawer, mask } = styles;
        if (containerRef && contianer.transform !== _styles.container) {
            containerRef.style.transform = contianer.transform;
            _styles.container = contianer.transform;
        }
        if (maskRef && (mask.opacity !== _styles.maskOpacity || mask.display !== _styles.maskDisplay)) {
            maskRef.style.display = mask.display;
            if (_styles.maskDisplay === 'none' && mask.display === 'block') {
                maskRef.style.opacity = '0';
                _styles.maskOpacity = 0;
                setTimeout(() => this.updateStyles(), 1);
            }
            else {
                maskRef.style.opacity = mask.opacity.toString().substr(0, 4);
                _styles.maskOpacity = mask.opacity;
            }
            _styles.maskDisplay = mask.display;
        }
        if (drawerRef && drawer.transform !== _styles.drawer) {
            drawerRef.style.transform = drawer.transform;
            _styles.drawer = drawer.transform;
        }
    }
    render() {
        let _a = this.props, { drawer, children, className, bodyClassName, containerProps = {}, drawerProps = {}, placement, draggable, mode, show, onShow, onHide, directionLockThreshold, dragBorderSize, noMask } = _a, others = __rest(_a, ["drawer", "children", "className", "bodyClassName", "containerProps", "drawerProps", "placement", "draggable", "mode", "show", "onShow", "onHide", "directionLockThreshold", "dragBorderSize", "noMask"]);
        mode = mode || 'cover';
        if (typeof drawer === 'function') {
            drawer = drawer();
        }
        draggable = typeof draggable === 'undefined' ? app_1.default.is.touch : draggable;
        let lastMaskDisplay = this.styles ? this.styles.mask.display : 'none';
        this.styles = this.getStyles();
        if (!show && !this.dragging && this.maskRef && lastMaskDisplay !== this.styles.mask.display) {
            this.styles.mask.display = lastMaskDisplay;
            setTimeout(() => {
                this.styles = this.getStyles();
                this.updateStyles();
            }, 300);
        }
        this.updateStyles();
        return (React.createElement(box_1.default, Object.assign({ className: classnames('s-drawer', `s-drawer-${placement}`, `s-drawer-${mode}`, {
                's-no-mask': noMask,
                's-draggable': draggable,
                's-show': show
            }, className), bodyClassName: classnames('s-drawer-body', bodyClassName) }, others, { bodyRef: this.handleBodyRef, onTouchStart: draggable ? this.handleStart : null, onTouchMove: draggable ? this.handleMove : null, onTouchEnd: draggable ? this.handleEnd : null, layout: "none" }),
            React.createElement(box_1.default, Object.assign({ layout: "none" }, drawerProps, { elRef: this.handleDrawerRef, className: classnames('s-drawer-drawer', drawerProps.className), onResize: this.handelDrawerResize }), drawer),
            !noMask && React.createElement("div", { className: "s-drawer-mask", onClick: show ? onHide : null, ref: this.handleMaskRef }),
            React.createElement(box_1.default, Object.assign({ layout: "fit" }, containerProps, { elRef: this.handleContainerRef, className: classnames('s-drawer-contianer', containerProps.className) }), children)));
    }
}
Drawer.defaultProps = {
    dragBorderSize: 0,
    directionLockThreshold: 10,
};
exports.default = Drawer;
app_1.default.components.Drawer = Drawer;
