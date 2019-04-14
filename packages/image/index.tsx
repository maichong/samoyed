import * as React from 'react';
import { ImageProps } from '.';

export default class Image extends React.Component<ImageProps> {
  ref: any;

  componentDidMount() {
    const { url, duration = 0 } = this.props;
    if (url && this.ref) {
      this.ref.style.backgroundImage = `url(${url})`;
      let img = new (window as any).Image();
      img.src = url;
      img.onload = () => {
        this.ref.style.opacity = 1;
        if (duration) {
          this.ref.style.transitionDuration = `${duration}ms`;
        }
      };
    }
  }

  render() {
    let { className = '' } = this.props;
    className = `image ${className}`;
    return (
      <div
        className={className}
        ref={(r: any) => {
          this.ref = r;
        }}
      />
    );
  }
}
