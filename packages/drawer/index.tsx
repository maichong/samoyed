import * as React from 'react';
import * as classnames from 'classnames';
import app from '@samoyed/app';
import { DrawerProps } from '.';

interface Position {
  x: number;
  y: number;
}

interface PositionString {
  x: string;
  y: string;
}

interface Styles {
  contianer: {
    transform?: string;
  };
  mask: {
    display: string;
    opacity: number;
  };
  drawer: {
    transform?: string;
  };
}

export default class Drawer extends React.Component<DrawerProps> {
  static defaultProps = {
    dragBorderSize: 0,
    directionLockThreshold: 10,
  };

  placement: string;
  elRef: HTMLDivElement;
  drawerRef: HTMLDivElement;
  continerRef: HTMLDivElement;
  maskRef: HTMLDivElement;
  // drawerHeight: number = 0;
  // drawerWidth: number = 0;
  dragging: boolean = false;
  draggingLock: boolean | null;
  draggingDirection: boolean;
  startPos: Position;
  lastPos: Position;
  flickStartPos: Position;
  styles: Styles;
  _styles: {
    container?: string;
    maskDisplay?: string;
    maskTransform?: string;
    maskOpacity?: number;
    drawer?: string;
  } = {};
  placementDirection = {
    left: true,
    right: false,
    top: true,
    bottom: false
  };

  get drawerHeight(): number {
    if (this.drawerRef) {
      console.log('this.drawerRef.children[0].clientHeight', this.drawerRef.children[0].clientHeight);
      return this.drawerRef.children[0].clientHeight;
    }
    return 800;
  };

  get drawerWidth(): number {
    if (this.drawerRef) {
      return this.drawerRef.children[0].clientWidth;
    }
    return 800;
  };

  getStyles(): Styles {
    const { mode, show, placement } = this.props;
    let drawer = { transform: '' };
    let contianer = { transform: '' };
    let mask = { opacity: show ? 1 : 0, display: show ? 'block' : 'none' };
    if (mode === 'slide') {
      let drawerPos: PositionString = { x: '0', y: '0' };
      let containerPos: PositionString = { x: '0', y: '0' };
      let drawerHeight = this.drawerHeight || 800;
      let drawerWidth = this.drawerWidth || 800;
      if (show) {
        switch (placement) {
          case 'top':
            containerPos.y = drawerHeight + 'px';
            break;
          case 'bottom':
            containerPos.y = -drawerHeight + 'px';
            break;
          case 'left':
            containerPos.x = drawerWidth + 'px';
            break;
          case 'right':
            containerPos.x = -drawerWidth + 'px';
            break;
        }
      } else {
        // hidden
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
    let { styles, continerRef, maskRef, drawerRef, _styles } = this;
    let { contianer, drawer, mask } = styles;
    if (continerRef && contianer.transform !== _styles.container) {
      continerRef.style.transform = contianer.transform;
      _styles.container = contianer.transform;
    }
    if (maskRef && (contianer.transform !== _styles.maskTransform || mask.opacity !== _styles.maskOpacity || mask.display !== _styles.maskDisplay)) {
      maskRef.style.display = mask.display;
      // fix 出现时，mask突然出现、没有动画的bug
      if (_styles.maskDisplay === 'none' && mask.display === 'block') {
        // 先显示出来
        _styles.maskTransform = 'translate(0,0)';
        maskRef.style.transform = _styles.maskTransform;
        maskRef.style.opacity = '0';
        _styles.maskOpacity = 0;
        // 延迟更新 Transform，实现动画
        setTimeout(() => this.updateStyles(), 1);
      } else {
        maskRef.style.transform = contianer.transform;
        maskRef.style.opacity = mask.opacity.toString().substr(0, 4);
        _styles.maskTransform = contianer.transform;
        _styles.maskOpacity = mask.opacity;
      }
      _styles.maskDisplay = mask.display;
    }
    if (drawerRef && drawer.transform !== _styles.drawer) {
      drawerRef.style.transform = drawer.transform;
      _styles.drawer = drawer.transform;
    }
  }

  handleRef = (r: HTMLDivElement) => {
    this.elRef = r;
  };

  handleDrawerRef = (r: HTMLDivElement) => {
    let init = !this.drawerRef;
    this.drawerRef = r;
    if (!r) return;
    if (init) {
      this.styles = this.getStyles();
    }
    this._styles.drawer = null;
    this.updateStyles();
  };

  handleContianerRef = (r: HTMLDivElement) => {
    this.continerRef = r;
    if (!r) return;
    this._styles.container = null;
    this.updateStyles();
  };

  handleMaskRef = (r: HTMLDivElement) => {
    this.maskRef = r;
    if (!r) return;
    this._styles.maskTransform = null;
    this._styles.maskDisplay = null;
    this._styles.maskOpacity = null;
    this.updateStyles();
  };

  handleStart = (e: any) => {
    if (e.touches.length > 1 || !this.drawerRef || !this.elRef) return;
    let { draggable, show, placement, onShow, onHide, dragBorderSize } = this.props;
    draggable = typeof draggable === 'undefined' ? app.is.touch : draggable;
    if (!draggable) return;
    let { clientX: x, clientY: y } = e.touches[0];
    if (!show) {
      if (!onShow) return;
      // 只允许从边缘开始拖拉
      if (dragBorderSize) {
        switch (placement) {
          case 'left':
            if (x > dragBorderSize) return;
            break;
          case 'top':
            if (y > dragBorderSize) return;
            break;
          case 'right':
            if ((window.innerWidth - x) > dragBorderSize) return;
            break;
          case 'bottom':
            if ((window.innerHeight - y) > dragBorderSize) return;
            break;
        }
      }
    } else {
      if (!onHide) return;
    }
    let pos = { x, y };
    this.startPos = pos;
    this.lastPos = pos;
    this.flickStartPos = pos;
    this.dragging = true;
    this.draggingDirection = true;
    this.draggingLock = null;
    this.elRef.classList.add('s-dragging');
    // console.log(this.draggingDirection);
  };

  handleMove = (e: any) => {
    if (!this.dragging || this.draggingLock === false) return;
    let { startPos, lastPos, props } = this;
    let { show, placement, mode, directionLockThreshold } = props;
    let { clientX: x, clientY: y } = e.touches[0];
    let pos = { x, y };
    let diff = 0;
    let maskOpacity = 0;
    let key: 'x' | 'y';
    let lockKey: 'x' | 'y';
    let value = 0;
    let drawerSize = 0;
    if (placement === 'left' || placement === 'right') {
      key = 'x';
      lockKey = 'y';
      value = x;
      drawerSize = this.drawerWidth;
    } else {
      key = 'y';
      lockKey = 'x';
      value = y;
      drawerSize = this.drawerHeight;
    }
    if (this.draggingLock === null) {
      if (Math.abs(value - startPos[key]) > directionLockThreshold) {
        this.draggingLock = true;
      } else if (Math.abs(pos[lockKey] - startPos[lockKey]) > directionLockThreshold) {
        this.draggingLock = false;
      }
    }
    if (!this.draggingLock || !drawerSize) return;
    let drawerPos: Position = { x: 0, y: 0 };
    let containerPos: Position = { x: 0, y: 0 };

    if (this.placementDirection[placement]) {
      if (!show) {
        // 拖拽打开
        diff = Math.max(0, value - startPos[key]);
        diff = Math.min(diff, drawerSize);
        maskOpacity = diff / drawerSize;
        drawerPos[key] = diff - drawerSize;
        if (mode === 'slide') {
          containerPos[key] = diff;
        }
      } else {
        // 拖拽关闭
        diff = Math.min(0, value - startPos[key]);
        diff = Math.max(diff, -drawerSize);
        maskOpacity = 1 - (diff / -drawerSize);
        drawerPos[key] = diff;
        if (mode === 'slide') {
          containerPos[key] = drawerSize + diff;
        }
      }
    } else {
      if (!show) {
        // 拖拽打开
        diff = Math.min(0, value - startPos[key]);
        diff = Math.max(diff, -drawerSize);
        maskOpacity = diff / -drawerSize;
        drawerPos[key] = drawerSize + diff;
        if (mode === 'slide') {
          containerPos[key] = diff;
        }
      } else {
        // 拖拽关闭
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
    // console.log('handleMove', drawerPos);
    this.updateStyles();
  };

  handleEnd = (e: any) => {
    // console.log('handleEnd', this);
    if (!this.dragging || !this.elRef) return;
    this.dragging = false;
    this.elRef.classList.remove('s-dragging');
    let { draggingDirection, draggingLock } = this;
    if (!draggingLock) return;
    let { show, onShow, onHide, placement } = this.props;
    if (!show && draggingDirection === this.placementDirection[placement]) {
      onShow();
      return;
    } else if (show && draggingDirection !== this.placementDirection[placement]) {
      onHide();
      return;
    }
    this.styles = this.getStyles();
    this.updateStyles();
  };

  render() {
    let {
      drawer, children, className, containerClassName, drawerClassName,
      placement, draggable, mode, show, onShow, onHide, directionLockThreshold, dragBorderSize,
      ...others
    } = this.props;

    mode = mode || 'cover';

    if (typeof drawer === 'function') {
      // @ts-ignore
      drawer = drawer();
    }

    draggable = typeof draggable === 'undefined' ? app.is.touch : draggable;

    if (placement !== this.placement) {
      this.placement = placement;
      // let r = this.drawerRef;
      // if (r) {
      //   this.drawerHeight = r.children[0].clientHeight;
      //   this.drawerWidth = r.children[0].clientWidth;
      // }
    }

    // @ts-ignore
    window.test = this;

    // fix 消失动画 mask 会突然消失
    let lastMaskDisplay = this.styles ? this.styles.mask.display : 'none';
    this.styles = this.getStyles();
    if (!show && !this.dragging && this.maskRef && lastMaskDisplay !== this.styles.mask.display) {
      this.styles.mask.display = lastMaskDisplay;
      setTimeout(() => {
        // 延迟更新 display 属性
        this.styles = this.getStyles();
        this.updateStyles();
      }, 300);
    }
    this.updateStyles();

    return (
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
        ref={this.handleRef}
        onTouchStart={draggable ? this.handleStart : null}
        onTouchMove={draggable ? this.handleMove : null}
        onTouchEnd={draggable ? this.handleEnd : null}
        {...others}
      >
        <div
          ref={this.handleDrawerRef}
          className={classnames('s-drawer-drawer', drawerClassName)}
        >
          {drawer}
        </div>
        <div className="s-drawer-mask" onClick={show ? onHide : null} ref={this.handleMaskRef} />
        <div
          className={classnames('s-drawer-contianer s-full', containerClassName)}
          ref={this.handleContianerRef}
        >
          {children}
        </div>
      </div>
    );
  }
}

app.components.Drawer = Drawer;
