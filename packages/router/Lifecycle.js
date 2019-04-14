"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Lifecycle extends React.Component {
    componentDidMount() {
        if (this.props.onMount)
            this.props.onMount.call(this, this);
    }
    componentDidUpdate(prevProps) {
        if (this.props.onUpdate)
            this.props.onUpdate.call(this, this, prevProps);
    }
    componentWillUnmount() {
        if (this.props.onUnmount)
            this.props.onUnmount.call(this, this);
    }
    render() {
        return null;
    }
}
exports.default = Lifecycle;
