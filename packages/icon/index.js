"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const app_1 = require("@samoyed/app");
function Icon(props) {
    const { className, name } = props;
    let fontFamily = props.fontFamily || app_1.default.defaults.iconFontFamily;
    let namePrefix = props.namePrefix || app_1.default.defaults.iconNamePrefix;
    let cls = `s-icon ${fontFamily} ${namePrefix}${name}`;
    if (className) {
        cls += ` ${className}`;
    }
    return React.createElement("i", { className: cls });
}
exports.default = Icon;
