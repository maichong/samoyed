"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_actions_1 = require("redux-actions");
exports.default = redux_actions_1.handleActions({
    APPLY_DEVICE: (state, action) => {
        let payload = action.payload;
        if (payload.site)
            return payload.site;
        return state;
    }
}, null);
