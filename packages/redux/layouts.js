"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const redux_actions_1 = require("redux-actions");
exports.default = redux_actions_1.handleActions({
    APPLY_DEVICE: (state, action) => {
        let payload = action.payload;
        if (!payload.layouts)
            return state;
        return {
            list: payload.layouts,
            map: _.keyBy(payload.layouts, 'id')
        };
    }
}, {});
