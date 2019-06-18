"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const redux_actions_1 = require("redux-actions");
exports.default = redux_actions_1.handleActions({
    APPLY_DEVICE: (state, action) => {
        let payload = action.payload;
        if (!payload.pages)
            return state;
        return {
            list: payload.pages,
            map: _.keyBy(payload.pages, 'id')
        };
    }
}, {});
