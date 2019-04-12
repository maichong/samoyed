import * as React from 'react';
import { ImageProps } from '.';

export default class Image extends React.Component<ImageProps> {
  ref: any;

  componentDidMount() {
    const { url, timeIn = '' } = this.props;
    if (url && this.ref) {
      this.ref.style.backgroundImage = `url(${url})`;
      let img = new (window as any).Image();
      img.src = url;
      img.onload = () => {
        this.ref.style.opacity = 1;
        if (timeIn) {
          this.ref.style.transitionDuration = timeIn;
        }
      };
    }
  }

  render() {
    let { className = '' } = this.props;
    className = 'image ' + className;
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
