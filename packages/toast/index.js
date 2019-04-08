"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_toastr_1 = require("react-toastr");
let container = null;
exports.defaultOptions = {
    type: 'info',
    closeButton: true,
    showAnimation: 'animated fadeInRight',
    hideAnimation: 'animated fadeOutRight',
    timeOut: 5000
};
class ToastContainer extends React.Component {
    componentWillUnmount() {
        if (container === this.ref) {
            container = null;
        }
    }
    render() {
        return (React.createElement(react_toastr_1.ToastContainer, { toastMessageFactory: undefined, className: this.props.className, ref: (r) => {
                this.ref = r;
                container = r;
            } }));
    }
}
exports.ToastContainer = ToastContainer;
function clear() {
    if (!container)
        return;
    container.clear();
}
exports.clear = clear;
function create(type) {
    return function (title, body, options) {
        if (!container)
            throw new Error('Toast container is not initialized');
        if (!options && body && typeof body === 'object' && !React.isValidElement(body)) {
            options = body;
            body = '';
        }
        options = options || {};
        let t = options.type || type || exports.defaultOptions.type;
        for (let key in exports.defaultOptions) {
            if (!options.hasOwnProperty(key)) {
                options[key] = exports.defaultOptions[key];
            }
        }
        container[t](body, title, options);
    };
}
exports.success = create('success');
exports.info = create('info');
exports.error = create('error');
exports.warning = create('warning');
exports.default = create();
