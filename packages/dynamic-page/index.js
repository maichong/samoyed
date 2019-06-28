"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const app_1 = require("@samoyed/app");
exports.context = React.createContext({});
class DynamicPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return 'DynamicPage';
    }
}
exports.default = DynamicPage;
app_1.default.components.DynamicPage = DynamicPage;
