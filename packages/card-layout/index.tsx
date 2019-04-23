import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { Animation } from '@samoyed/types';
import { CardLayoutProps } from '.';

interface State {
  _activeItem: number;
  active?: React.ReactElement;
  last?: React.ReactElement;
  animation?: Animation;
  animationAction: 'forward' | 'backward';
}

class CardLayout extends React.Component<CardLayoutProps, State> {
  animationLock?: string;
  animationTimer?: number;
  animationStage?: 'start' | 'active' | 'done';
  elRef?: HTMLElement;

  constructor(props: CardLayoutProps) {
    super(props);
    this.state = {
      _activeItem: -1,
      animationAction: 'forward'
    };
  }

  static getDerivedStateFromProps(nextProps: CardLayoutProps, prevState: State): Partial<State> | null {
    let activeItem = nextProps.activeItem || 0;
    if (activeItem === prevState._activeItem) return null;
    let elements = nextProps.children as React.ReactElement[];
    if (!Array.isArray(elements)) {
      console.warn('Card layout children must be node array!');
      elements = elements ? [elements] : [];
    }
    let active = elements[activeItem] || elements[0];

    let state: Partial<State> = {
      _activeItem: activeItem,
      active
    };
    if (state._activeItem < prevState._activeItem) {
      state.animationAction = 'backward';
    } else {
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

  handleRef = (ref: HTMLElement) => {
    this.elRef = ref;
    const { elRef } = this.props;
    if (elRef) {
      elRef(ref);
    }
  };

  updateAnimation = () => {
    if (!this.elRef) return;
    const { animation } = this.state;
    if (!animation) return;
    let classList = new Set(Array.from(this.elRef.classList));
    if (this.animationStage === 'start') {
      this.animationStage = 'active';
      this.animationTimer = setTimeout(this.updateAnimation, animation.duration || app.defaults.animationDuration);
      classList.delete('s-done');
      classList.delete('s-start');
      classList.add('s-active');
    } else if (this.animationStage === 'active') {
      this.animationStage = 'done';
      classList.add('s-done');
      classList.delete('s-start');
      classList.delete('s-active');
      this.setState({ animation: null });
    }
    this.elRef.className = Array.from(classList).join(' ');
  };

  render() {
    const { className } = this.props;
    const { active, last, animation, animationAction } = this.state;

    let children: React.ReactElement[] = [];

    if (active) {
      children.push(React.cloneElement(active, {
        key: 'active',
        active: true
      }));
    }

    let duration = app.defaults.animationDuration;
    let animationType;

    if (last && animation && animation.type) {
      animationType = animation.type;
      children.push(React.cloneElement(last, {
        key: 'last',
        last: true
      }));
      duration = animation.duration || app.defaults.animationDuration;

      this.animationStage = 'start';
      if (this.animationTimer) clearTimeout(this.animationTimer);
      this.animationTimer = setTimeout(this.updateAnimation, 100);

      if (this.elRef) {
        let classList = this.elRef.classList;
        if (classList.contains('s-active')) classList.remove('s-active');
        if (classList.contains('s-done')) classList.remove('s-done');
      }
    }

    return (
      <div
        className={classnames(
          's-layout-card',
          className,
          {
            's-animation': animation,
            's-vertical': animation && animation.direction === 'vertical',
            's-horizontal': animation && animation.direction !== 'vertical',
            's-forward': animation && animationAction === 'forward',
            's-backward': animation && animationAction === 'backward',
            's-start': animation,
            [`s-duration-${duration}`]: animation,
            [`s-${animationType}`]: animationType,
          }
        )}
        ref={this.handleRef}
      >{children}</div>
    );
  }
}

// app.components.CardLayout = CardLayout;

export default CardLayout;
