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
const _ = require("lodash");
const React = require("react");
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
const ResizeSensor = require('css-element-queries/src/ResizeSensor');
const ResizeObserver = window.ResizeObserver;
class Box extends React.Component {
    constructor() {
        super(...arguments);
        this.lastScrollTop = 0;
        this.handleResize = (entries) => {
            if (!this.props.onResize)
                return;
            let rect;
            if (Array.isArray(entries)) {
                rect = entries[0].contentRect;
            }
            else if (this.ref) {
                rect = this.ref.getBoundingClientRect();
            }
            else {
                rect = DOMRect.fromRect(entries);
            }
            this.props.onResize(rect);
        };
        this.handleRef = (r) => {
            const { elRef } = this.props;
            if (elRef) {
                elRef(r);
            }
            if (!this.props.onResize) {
                this.disconnect();
                return;
            }
            if ((this.observer || this.sensor) && r !== this.ref) {
                this.disconnect();
            }
            this.ref = r;
            this.init();
        };
        this.handleScroll = (event) => {
            const currentTarget = event.currentTarget;
            const { scrollHeight, clientHeight, scrollTop, scrollLeft } = currentTarget;
            const { scrollable, onBodyScroll, onReachBottom, reachBottomBorder = 0 } = this.props;
            const vertical = scrollable === 'both' || scrollable === 'vertical';
            if (onBodyScroll) {
                onBodyScroll({
                    scrollTop,
                    scrollLeft,
                    scrollHeight,
                    scrollWidth: currentTarget.scrollWidth,
                    clientHeight,
                    clientWidth: currentTarget.clientWidth
                });
            }
            let bottom = scrollHeight - clientHeight - scrollTop;
            if (this.reachedBottom) {
                if (scrollTop < this.lastScrollTop
                    || bottom > reachBottomBorder) {
                    this.reachedBottom = false;
                }
            }
            else if (vertical && onReachBottom && scrollTop > this.lastScrollTop) {
                if (bottom <= reachBottomBorder) {
                    this.reachedBottom = true;
                    onReachBottom();
                }
            }
            this.lastScrollTop = scrollTop;
        };
    }
    componentDidMount() {
        this.init();
    }
    componentDidUpdate() {
        this.init();
    }
    componentWillUnmount() {
        this.disconnect();
        this.ref = null;
    }
    init() {
        if (this.observer || this.sensor || !this.ref)
            return;
        if (!this.props.onResize) {
            this.disconnect();
            return;
        }
        if (typeof ResizeObserver === 'function') {
            this.observer = new ResizeObserver(this.handleResize);
            this.observer.observe(this.ref);
            return;
        }
        this.sensor = new ResizeSensor(this.ref, this.handleResize);
    }
    disconnect() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        if (this.sensor) {
            this.sensor.detach();
            this.sensor = null;
        }
    }
    render() {
        let _a = this.props, { children, className, bodyClassName, style, bodyStyle, elRef, bodyRef, width, height, bg, flex, scrollable, layout, activeItem, animation, previous, last, active, wrapper, wrapperProps, onResize, dock, dockPlacement, onBodyScroll, reachBottomBorder, onReachBottom } = _a, others = __rest(_a, ["children", "className", "bodyClassName", "style", "bodyStyle", "elRef", "bodyRef", "width", "height", "bg", "flex", "scrollable", "layout", "activeItem", "animation", "previous", "last", "active", "wrapper", "wrapperProps", "onResize", "dock", "dockPlacement", "onBodyScroll", "reachBottomBorder", "onReachBottom"]);
        style = _.assign({}, style);
        if (height || height === 0) {
            style.height = height;
        }
        if (width || width === 0) {
            style.width = width;
        }
        const vertical = scrollable === 'both' || scrollable === 'vertical';
        let layoutProps = {
            ref: bodyRef,
            style: bodyStyle,
            onScroll: (scrollable && onBodyScroll) || (vertical && onReachBottom) ? this.handleScroll : null,
        };
        let LayoutComponent = 'div';
        let layoutClassName = `s-layout-${layout || 'auto'}`;
        if (layout === 'card') {
            LayoutComponent = app_1.default.components.CardLayout;
            if (!LayoutComponent) {
                throw new Error('@samoyed/card-layout must be required!');
            }
            layoutProps.activeItem = activeItem;
            layoutProps.animation = animation;
        }
        if (['card', 'none'].indexOf(layout) > -1) {
            layoutClassName = '';
        }
        layoutProps.className = classnames('s-box-body', bodyClassName, layoutClassName, {
            's-scrollable-horizontal': scrollable === 'both' || scrollable === 'horizontal',
            's-scrollable-vertical': scrollable === 'both' || scrollable === 'vertical',
            [`bg-${bg}`]: bg
        });
        let dockClassName = '';
        if (dock) {
            dockClassName = `s-dock s-dock-${dockPlacement || 'top'}`;
        }
        let el = (React.createElement("div", Object.assign({ ref: this.handleRef, className: classnames('s-component', 's-box', className, dockClassName, {
                's-flex': !!flex,
                's-previous': previous,
                's-last': last,
                's-active': active,
            }), style: style }, others),
            dock,
            React.createElement(LayoutComponent, Object.assign({}, layoutProps), children)));
        if (wrapper) {
            if (app_1.default._wrapperHooks.indexOf(wrapper) === -1) {
                app_1.default._wrapperHooks.push(wrapper);
            }
            let wrappers = app_1.default.wrappers[wrapper];
            if (wrappers && wrappers.length) {
                el = wrappers.reduce((c, Wrapper) => React.createElement(Wrapper, wrapperProps, c), el);
            }
        }
        return el;
    }
}
exports.default = Box;
app_1.default.components.Box = Box;
