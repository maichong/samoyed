"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("./immutable");
const map = new WeakMap();
function updateState(ref, path) {
    let paths = map.get(ref);
    if (!paths) {
        paths = {};
        map.set(ref, paths);
    }
    let fn = paths[path];
    if (!fn) {
        let arr = path.split('.');
        let first = arr.shift();
        fn = (value) => {
            if (arr.length === 0) {
                ref.setState({
                    [path]: value
                });
                return;
            }
            let object = ref.state[first];
            object = immutable_1.default.setIn(object, arr, value);
            ref.setState({
                [first]: object
            });
        };
        paths[path] = fn;
    }
    return fn;
}
exports.default = updateState;
