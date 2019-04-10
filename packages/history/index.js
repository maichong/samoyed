"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createMemoryHistory_1 = require("history/createMemoryHistory");
const history = createMemoryHistory_1.default();
history.free = () => {
    console.log('free');
};
exports.default = history;
