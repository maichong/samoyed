"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function Image(props) {
    const style = {};
    ['width', 'height'].forEach((key) => {
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
        if (!url)
            return;
        let img = new window.Image();
        img.src = url;
        img.onload = () => {
            let div = ref.current;
            if (!div)
                return;
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
    return (React.createElement("div", { ref: ref, className: className, style: Object.keys(style).length ? style : null }));
}
exports.default = Image;
