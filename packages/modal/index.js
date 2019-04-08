"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const random = require("string-random");
const tr = require("grackle");
const Modal = require('react-bootstrap/Modal');
const updaters = new Set();
const items = [];
function isOptions(options) {
    return options && typeof options === 'object' && !React.isValidElement(options);
}
function create(type) {
    return function (title, body, options) {
        if (!options && isOptions(body)) {
            options = body;
            body = null;
        }
        options = options || {};
        let btns = options.buttons;
        if (!btns) {
            btns = [{ text: tr([type + '_button_OK', 'button_OK', 'OK']), color: 'primary' }];
            if (type !== 'alert') {
                btns.unshift({ text: tr([type + '_button_cancel', 'button_cancel', 'Cancel']) });
            }
        }
        return new Promise((resolve) => {
            let buttons = btns.map((btn, index) => (React.createElement("button", { key: index, className: 'btn btn-' + (btn.color || 'light'), onClick: () => handle(index) }, btn.text)));
            let item = {
                id: random(),
                type,
                title,
                body,
                buttons,
                options,
                cancel: function () {
                    handle(0);
                }
            };
            items.push(item);
            function close(btn) {
                items.splice(items.indexOf(item), 1);
                updaters.forEach((update) => update());
                if (type === 'prompt') {
                    resolve(btn === 0 ? '' : item.promptValue);
                }
                else {
                    resolve(btn);
                }
            }
            function handle(btn) {
                if (options.handle) {
                    let res = options.handle(btn);
                    if (res === false)
                        return;
                    if (res && typeof res.then === 'function') {
                        res.then((r) => {
                            if (r === false)
                                return;
                            close(btn);
                        });
                        return;
                    }
                }
                close(btn);
            }
            updaters.forEach((update) => update());
        });
    };
}
exports.alert = create('alert');
exports.confirm = create('confirm');
exports.prompt = create('prompt');
function renderItem(item) {
    let { title, options } = item;
    let itemBody = item.body;
    let body = null;
    if (itemBody && itemBody instanceof React.Component) {
        itemBody = React.createElement(itemBody, {});
    }
    if (item.type === 'prompt') {
        itemBody = (React.createElement("div", null,
            itemBody,
            React.createElement("div", { className: "form-group" },
                React.createElement("input", { type: "text", className: "form-control", placeholder: options.placeholder, value: item.promptValue, onChange: (e) => {
                        item.promptValue = e.target.value;
                        updaters.forEach((update) => update());
                    } }))));
    }
    if (itemBody) {
        body = React.createElement(Modal.Body, null, itemBody);
    }
    return (React.createElement(Modal, { key: item.id, show: true, centered: true, onHide: item.cancel },
        React.createElement(Modal.Header, { closeButton: true }, title),
        body,
        item.buttons.length && React.createElement("div", { className: "modal-footer" }, item.buttons)));
}
class ModalContainer extends React.Component {
    constructor() {
        super(...arguments);
        this.update = () => {
            this.forceUpdate();
        };
    }
    componentDidMount() {
        updaters.add(this.update);
    }
    componentWillUnmount() {
        updaters.delete(this.update);
    }
    render() {
        return items.map(renderItem);
    }
}
exports.default = ModalContainer;
