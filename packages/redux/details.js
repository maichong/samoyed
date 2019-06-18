"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const redux_actions_1 = require("redux-actions");
const akita_1 = require("akita");
const app_1 = require("@samoyed/app");
const immutable_1 = require("@samoyed/utils/immutable");
const LOAD_DETAIL = 'LOAD_DETAIL';
const APPLY_DETAIL = 'APPLY_DETAIL';
const BATCH_APPLY_DETAILS = 'BATCH_APPLY_DETAILS';
const CLEAR_DETAILS = 'CLEAR_DETAILS';
const BATCH_CLEAR_DETAILS = 'BATCH_CLEAR_DETAILS';
exports.clearDetails = redux_actions_1.createAction(CLEAR_DETAILS);
exports.batchClearDetails = redux_actions_1.createAction(BATCH_CLEAR_DETAILS);
exports.loadDetail = redux_actions_1.createAction(LOAD_DETAIL);
exports.applyDetail = redux_actions_1.createAction(APPLY_DETAIL);
exports.batchApplyDetails = redux_actions_1.createAction(BATCH_APPLY_DETAILS);
app_1.default.addAction('clearDetails', exports.clearDetails);
app_1.default.addAction('batchClearDetails', exports.batchClearDetails);
app_1.default.addAction('loadDetail', exports.loadDetail);
app_1.default.addAction('applyDetail', exports.applyDetail);
const INITIAL_STATE = {};
const EMPTY_RECORD = {
    id: '',
    error: null,
    fetching: false,
    loaded: false,
    rev: 0
};
exports.default = redux_actions_1.handleActions({
    REFRESH: () => INITIAL_STATE,
    CLEAR_DETAILS: (state, action) => {
        const payload = action.payload;
        const { model, ids } = payload;
        if (!ids) {
            return immutable_1.default.without(state, model);
        }
        let map = state[model];
        if (!map)
            return state;
        map = immutable_1.default.without(map, ids);
        return immutable_1.default.set(state, model, map);
    },
    BATCH_CLEAR_DETAILS: (state, action) => {
        const payload = action.payload;
        payload.forEach(({ model, ids }) => {
            if (ids) {
                let map = state[model];
                if (map) {
                    map = immutable_1.default.without(map, ids);
                    state = immutable_1.default.set(state, model, map);
                }
            }
            else {
                state = immutable_1.default.without(state, model);
            }
        });
        return state;
    },
    LOAD_DETAIL: (state, action) => {
        let payload = action.payload;
        let map = state[payload.model] || {};
        let record = map[payload.id] || _.clone(EMPTY_RECORD);
        record = immutable_1.default.merge(record, { fetching: true, error: null });
        map = immutable_1.default.set(map, payload.id, record);
        return immutable_1.default.set(state, payload.model, map);
    },
    APPLY_DETAIL: (state, action) => {
        const payload = action.payload;
        let { model, data } = payload;
        let map = state[model] || {};
        let record = map[data.id] || EMPTY_RECORD;
        let rev = data.rev || Date.now();
        record = _.defaults({ fecting: false, error: data.error, loaded: !data.error, rev }, data, record);
        map = immutable_1.default.set(map, data.id, record);
        return immutable_1.default.set(state, model, map);
    },
    BATCH_APPLY_DETAILS: (state, action) => {
        const payload = action.payload;
        for (let { model, data } of payload) {
            let map = state[model] || {};
            let record = map[data.id] || EMPTY_RECORD;
            let rev = data.rev || Date.now();
            record = _.defaults({ fecting: false, error: data.error, loaded: !data.error, rev }, data, record);
            map = immutable_1.default.set(map, data.id, record);
            state = immutable_1.default.set(state, model, map);
        }
        return state;
    },
    LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);
const fetching = {};
let queue = [];
let timer = 0;
function generateDetailApiUrl(params) {
    return `${params.model}/${params.id}`;
}
function* detailSaga({ payload }) {
    let fn = app_1.default.defaults.generateDetailApiUrl || generateDetailApiUrl;
    let url = fn({ model: payload.model, id: payload.id });
    try {
        if (fetching[url]) {
            return;
        }
        fetching[url] = true;
        let res = yield akita_1.default.get(url);
        fetching[url] = false;
        queue.push({ model: payload.model, data: res });
    }
    catch (e) {
        fetching[url] = false;
        queue.push({
            model: payload.model,
            data: {
                id: payload.id,
                error: e.message
            }
        });
    }
    if (!timer) {
        timer = window.setTimeout(() => {
            timer = 0;
            let cur = queue;
            queue = [];
            if (cur.length) {
                app_1.default.store.dispatch(exports.batchApplyDetails(cur));
            }
        }, 50);
    }
}
exports.detailSaga = detailSaga;
