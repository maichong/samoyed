"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const _ = require("lodash");
const classnames = require("classnames");
const shallowEqualWithout = require("shallow-equal-without");
const akita_1 = require("akita");
let client = akita_1.default.create({});
class ImageField extends React.Component {
    constructor(props) {
        super(props);
        this.handleAddImage = () => {
            let { multi, value, allowed, maxSize, max } = this.props;
            let newValue = value;
            if (value) {
                if (!multi) {
                    newValue = [value];
                }
                else {
                    newValue = value.concat();
                }
            }
            let nextState = {
                error: ''
            };
            max = multi ? (max || 1000) : 1;
            _.forEach(this.imageInput.files, (file) => {
                if (newValue.length >= max || !file)
                    return;
                let matchs = file.name.match(/\.(\w+)$/);
                if (!matchs) {
                    nextState.error = 'Invalid image format';
                    return;
                }
                let ext = matchs[1].replace('jpeg', 'jpg').toLowerCase();
                if ((allowed || ['png', 'jpg', 'svg', 'webp']).indexOf(ext) < 0) {
                    nextState.error = 'Invalid image format';
                    return;
                }
                if (file.size && file.size > maxSize) {
                    nextState.error = 'Image exceeds the allowed size';
                    return;
                }
                this.uploadQueue.push(file);
            });
            this.setState(nextState);
            if (this.uploadQueue.length && !this.currentTask)
                this.upload();
        };
        this.state = {
            error: '',
        };
        this.uploadQueue = [];
    }
    shouldComponentUpdate(props, state) {
        return !shallowEqualWithout(props, this.props, 'record') || state.error !== this.state.error;
    }
    async upload() {
        const { apiUrl, multi, mode } = this.props;
        let file = this.uploadQueue.shift();
        if (!file)
            return;
        this.currentTask = file;
        try {
            let image = await client.post(apiUrl, {
                body: {
                    file
                }
            });
            let item = mode === 'link' ? image.url : image;
            let { value, onChange } = this.props;
            if (multi) {
                value = (value || []).concat(item);
                onChange(value);
            }
            else {
                onChange(item);
            }
        }
        catch (e) {
            this.setState({ error: e.message });
        }
        this.currentTask = null;
        if (this.uploadQueue.length) {
            this.upload();
        }
    }
    handleRemoveItem(index) {
        let value = null;
        if (this.props.multi) {
            value = [];
            _.map(this.props.value, (url, i) => {
                if (i !== index) {
                    value.push(url);
                }
            });
        }
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
    render() {
        let { className, value, multi, help, label, disabled, error, max } = this.props;
        max = multi ? (max || 1000) : 1;
        let newValue = value;
        if (!multi) {
            newValue = value ? [value] : [];
        }
        let items = [];
        let readonly = disabled;
        _.forEach(newValue, (url, index) => {
            if (url && typeof url === 'object') {
                url = url.thumbUrl || url.url;
            }
            items.push((React.createElement("div", { key: index, className: "image-field-item" },
                React.createElement("img", { alt: "", src: url }),
                readonly ? null : (React.createElement("div", { className: "image-field-del", onClick: () => this.handleRemoveItem(index) }, "X")))));
        });
        if (items.length < max) {
            if (!readonly) {
                items.push((React.createElement("div", { className: "image-field-item image-field-add", key: "add" },
                    React.createElement("i", { className: "fa fa-plus-square-o" }),
                    React.createElement("input", { ref: (r) => {
                            this.imageInput = r;
                        }, multiple: multi || false, accept: "image/png;image/jpg;", type: "file", onChange: this.handleAddImage }))));
            }
        }
        if (!items.length && readonly) {
            items.push((React.createElement("div", { className: "image-field-item image-field-add", key: "add" },
                React.createElement("i", { className: "fa fa-picture-o" }))));
        }
        error = error || this.state.error;
        return (React.createElement("div", { className: classnames('s-component s-field s-field-image form-group', className, { 'is-invalid': error }) },
            label && React.createElement("label", null, label),
            React.createElement("div", null, items),
            error && React.createElement("small", { className: "form-text invalid-feedback" }, error),
            help && React.createElement("small", { className: classnames('form-text', { 'invalid-feedback': error, 'text-muted': !error }) }, help)));
    }
}
ImageField.defaultProps = {
    apiUrl: '/api/image'
};
exports.default = ImageField;
