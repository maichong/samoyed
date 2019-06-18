"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const redux_actions_1 = require("redux-actions");
const immutable_1 = require("@samoyed/utils/immutable");
const app_1 = require("@samoyed/app");
const APPLY_USER = 'APPLY_USER';
exports.applyUser = redux_actions_1.createAction(APPLY_USER);
app_1.default.addAction('applyUser', exports.applyUser);
const INITIAL_STATE = {
    id: '',
    displayName: '',
    avatar: ''
};
exports.default = redux_actions_1.handleActions({
    APPLY_DEVICE: (state, action) => {
        let payload = action.payload;
        if (payload.user)
            return payload.user;
        return state;
    },
    APPLY_USER: (state, action) => {
        let user = action.payload;
        if (_.isEqual(state, user)) {
            return state;
        }
        return immutable_1.default.merge(state, user);
    },
    LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);
