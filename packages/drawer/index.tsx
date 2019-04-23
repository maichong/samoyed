import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { DrawerProps } from '.';

// @ts-ignore
const Hammer = require('react-hammerjs').default;

console.log('Hammer', Hammer);

export default class Drawer extends React.Component<DrawerProps> {
  drawerRef: HTMLDivElement;
  continerRef: HTMLDivElement;
  drawerHeight: number = 0;
  drawerWidth: number = 0;

  getStyles() {
    const { mode, show, placement } = this.props;
    let drawer: any = {};
    let contianer: any = {};
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
      } else {
        // hidden
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

  handleDrawerRef = (r: HTMLDivElement) => {
    let init = !this.drawerRef;
    this.drawerRef = r;
    if (!r) return;
    this.drawerHeight = r.children[0].clientHeight;
    this.drawerWidth = r.children[0].clientWidth;
    if (init && this.props.mode === 'slide') {
      this.forceUpdate();
    }
  };

  handlePanStart = (e: HammerInput) => {
    console.log('handlePanStart', e);
  };

  handlePan = (e: HammerInput) => {
    console.log('handlePan', e);
  };

  handlePanEnd = (e: HammerInput) => {
    console.log('handlePanEnd', e);
  };

  render() {
    let {
      children, className, bodyClassName,
      drawer, placement, draggable, mode, containerClassName, drawerClassName,
      show, onShow, onHide,
      ...others
    } = this.props;

    mode = mode || 'cover';

    if (typeof drawer === 'function') {
      // @ts-ignore
      drawer = drawer();
    }

    draggable = typeof draggable === 'undefined' ? app.is.touch : draggable;
    console.log('draggable', draggable);

    let styles = this.getStyles();

    let el = (
      <div
        className={classnames(
          's-component',
          's-drawer',
          `s-drawer-${placement}`,
          `s-drawer-${mode}`,
          {
            's-draggable': draggable,
            's-show': show
          },
          className
        )}
        {...others}
      >
        <div
          ref={this.handleDrawerRef}
          className={classnames('s-drawer-drawer', drawerClassName)}
          style={styles.drawer}
        >
          {drawer}
        </div>
        {show && <div className="s-drawer-mask" onClick={onHide} style={styles.contianer} />}
        <div
          className={classnames('s-drawer-contianer s-full', containerClassName)}
          style={styles.contianer}
        >
          {children}
        </div>
      </div>
    );

    if (draggable) {
      el = <Hammer
        onPanStart={this.handlePanStart}
        onPan={this.handlePan}
        onPanEnd={this.handlePanEnd}
      >{el}</Hammer>;
    }

    return el;
  }
}
