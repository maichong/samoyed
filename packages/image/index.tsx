import * as React from 'react';
import { ImageProps } from '.';

export default function Image(props: ImageProps) {
  const style: any = {};
  ['width', 'height'].forEach((key) => {
    // @ts-ignore indexer
    let value = props[key];
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = parseInt(value);
    }
    if (value) {
      style[key] = value;
    }
  });

  let ref = React.useRef();
  React.useEffect(() => {
    const { url } = props;
    if (!url) return;
    let img = new (window as any).Image();
    img.src = url;
    img.onload = () => {
      let div: HTMLElement = ref.current;
      if (!div) return;
      div.style.opacity = '1';
      div.style.backgroundImage = `url(${url})`;
      if (!style.height || !div.clientHeight) {
        let width = div.clientWidth;
        let height = width / img.width * img.height;
        div.style.height = `${height.toFixed(2)}px`;
      }
    };
  }, [props.url]);

  let { className = '', mode } = props;
  className = `s-image ${className}`;

  if (mode === 'contain') {
    className += ' s-image-contain';
  }

  return (
    <div
      ref={ref}
      className={className}
      style={Object.keys(style).length ? style : null}
    />
  );
}
