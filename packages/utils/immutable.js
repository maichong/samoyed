"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function set(object, key, value) {
    object = Object.assign({}, object);
    object[key] = value;
    return object;
}
function setIn(object, paths, value) {
    let objects = [object];
    let current = object;
    for (let i = 0; i < paths.length - 1; i++) {
        let key = paths[i];
        current = current[key];
        objects.push(current);
    }
    current = value;
    for (let i = objects.length - 1; i >= 0; i -= 1) {
        current = set(objects[i], paths[i], current);
        objects[i] = current;
    }
    return objects[0];
}
function without(object, key) {
    if (_.isArray(key))
        return _.omit(object, key);
    object = Object.assign({}, object);
    delete object[key];
    return object;
}
function merge(object, data) {
    return Object.assign({}, object, data);
}
exports.default = {
    set,
    setIn,
    without,
    merge
};
