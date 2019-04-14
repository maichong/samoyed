"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Image extends React.Component {
    componentDidMount() {
        const { url, duration = 0 } = this.props;
        if (url && this.ref) {
            this.ref.style.backgroundImage = `url(${url})`;
            let img = new window.Image();
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
        return (React.createElement("div", { className: className, ref: (r) => {
                this.ref = r;
            } }));
    }
}
exports.default = Image;
