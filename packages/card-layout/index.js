"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classnames = require("classnames");
const app_1 = require("@samoyed/app");
class CardLayout extends React.Component {
    constructor(props) {
        super(props);
        this.handleRef = (ref) => {
            this.elRef = ref;
            const { elRef } = this.props;
            if (elRef) {
                elRef(ref);
            }
        };
        this.updateAnimation = () => {
            if (!this.elRef)
                return;
            const { animation } = this.state;
            if (!animation)
                return;
            let classList = new Set(Array.from(this.elRef.classList));
            if (this.animationStage === 'start') {
                this.animationStage = 'active';
                this.animationTimer = setTimeout(this.updateAnimation, animation.duration || app_1.default.defaults.animationDuration);
                classList.delete('s-done');
                classList.delete('s-start');
                classList.add('s-active');
            }
            else if (this.animationStage === 'active') {
                this.animationStage = 'done';
                classList.add('s-done');
                classList.delete('s-start');
                classList.delete('s-active');
                this.setState({ animation: null });
            }
            this.elRef.className = Array.from(classList).join(' ');
        };
        this.state = {
            _activeItem: -1,
            animationAction: 'forward'
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let activeItem = nextProps.activeItem || 0;
        if (activeItem === prevState._activeItem)
            return null;
        let elements = nextProps.children;
        if (!Array.isArray(elements)) {
            console.warn('Card layout children must be node array!');
            elements = elements ? [elements] : [];
        }
        let active = elements[activeItem] || elements[0];
        let state = {
            _activeItem: activeItem,
            active
        };
        if (state._activeItem < prevState._activeItem) {
            state.animationAction = 'backward';
        }
        else {
            state.animationAction = 'forward';
        }
        if (prevState.active) {
            state.last = prevState.active;
        }
        let animation = nextProps.animation;
        if (typeof animation === 'string') {
            animation = { type: animation };
        }
        if (animation !== prevState.animation) {
            state.animation = animation;
        }
        return state;
    }
    render() {
        const { className } = this.props;
        const { active, last, animation, animationAction } = this.state;
        let children = [];
        if (active) {
            children.push(React.cloneElement(active, {
                key: 'active',
                active: true
            }));
        }
        let duration = app_1.default.defaults.animationDuration;
        let animationType;
        if (last && animation && animation.type) {
            animationType = animation.type;
            children.push(React.cloneElement(last, {
                key: 'last',
                last: true
            }));
            duration = animation.duration || app_1.default.defaults.animationDuration;
            this.animationStage = 'start';
            if (this.animationTimer)
                clearTimeout(this.animationTimer);
            this.animationTimer = setTimeout(this.updateAnimation, 100);
            if (this.elRef) {
                let classList = this.elRef.classList;
                if (classList.contains('s-active'))
                    classList.remove('s-active');
                if (classList.contains('s-done'))
                    classList.remove('s-done');
            }
        }
        return (React.createElement("div", { className: classnames('s-layout-card', className, {
                's-animation': animation,
                's-vertical': animation && animation.direction === 'vertical',
                's-horizontal': animation && animation.direction !== 'vertical',
                's-forward': animation && animationAction === 'forward',
                's-backward': animation && animationAction === 'backward',
                's-start': animation,
                [`s-duration-${duration}`]: animation,
                [`s-${animationType}`]: animationType,
            }), ref: this.handleRef }, children));
    }
}
exports.default = CardLayout;
