"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const redux_actions_1 = require("redux-actions");
const effects_1 = require("redux-saga/effects");
const app_1 = require("@samoyed/app");
const immutable_1 = require("@samoyed/utils/immutable");
const akita_1 = require("akita");
const select_list_1 = require("@samoyed/utils/select-list");
const CLEAR_LIST = 'CLEAR_LIST';
const LOAD_LIST = 'LOAD_LIST';
const LOAD_MORE = 'LOAD_MORE';
const APPLY_LIST = 'APPLY_LIST';
const LOAD_LIST_FAILURE = 'LOAD_LIST_FAILURE';
exports.clearList = redux_actions_1.createAction(CLEAR_LIST);
exports.loadList = redux_actions_1.createAction(LOAD_LIST, (req) => _.assign(req, {
    limit: req.limit || app_1.default.defaults.listLimit,
    search: req.search || '',
    sort: req.sort || '',
    filters: !req.filters || _.isEmpty(req.filters) ? null : req.filters,
    populations: !req.populations || _.isEmpty(req.populations) ? null : req.populations,
}));
exports.loadMore = redux_actions_1.createAction(LOAD_MORE);
exports.applyList = redux_actions_1.createAction(APPLY_LIST, (model, res) => _.assign({ model }, res));
exports.loadListFailure = redux_actions_1.createAction(LOAD_LIST_FAILURE, (model, error) => ({ model, error }));
app_1.default.addAction('clearList', exports.clearList);
app_1.default.addAction('loadList', exports.loadList);
app_1.default.addAction('loadMore', exports.loadMore);
app_1.default.addAction('applyList', exports.applyList);
const INITIAL_STATE = {};
const EMPTY_LISTS = [];
const EMPTY_LIST = {
    model: '',
    search: '',
    sort: '',
    filters: null,
    populations: null,
    limit: 0,
    error: null,
    fetching: false,
    loaded: false,
    rev: 0,
    total: 0,
    page: 1,
    totalPage: 1,
    previous: 0,
    next: 0,
    results: [],
    map: {}
};
function applyListData(lists, selector, data) {
    lists = lists || EMPTY_LISTS;
    let matched = false;
    lists = _.map(lists, (list) => {
        if (!matched && select_list_1.matchList(list, selector)) {
            list = immutable_1.default.merge(list, data);
            matched = true;
        }
        return list;
    });
    if (!matched) {
        lists = lists.concat([immutable_1.default.merge(EMPTY_LIST, data)]);
    }
    return lists;
}
function applyDetailsData(lists, data) {
    return _.map(lists, (list) => {
        let found = false;
        let results = _.map(list.results, (record) => {
            if (record.id === data.id) {
                found = true;
                return immutable_1.default.merge(record, data);
            }
            return record;
        });
        if (found) {
            let map = immutable_1.default.set(list.map, data.id, data);
            list = immutable_1.default.merge(list, { results, map });
        }
        return list;
    });
}
exports.default = redux_actions_1.handleActions({
    REFRESH: () => INITIAL_STATE,
    LOAD_LIST: (state, action) => {
        const payload = action.payload;
        return immutable_1.default.set(state, payload.model, applyListData(state[payload.model], payload, _.defaults({ fetching: true }, payload)));
    },
    LOAD_MORE: (state, action) => {
        const payload = action.payload;
        return immutable_1.default.set(state, payload.model, applyListData(state[payload.model], payload.list, { fetching: true }));
    },
    CLEAR_LIST: (state, action) => {
        const payload = action.payload;
        return payload.model ? immutable_1.default.without(state, payload.model) : INITIAL_STATE;
    },
    APPLY_LIST: (state, action) => {
        const payload = action.payload;
        let model = payload.model;
        let lists = state[payload.model] || EMPTY_LISTS;
        let data = _.defaults({ error: null, fetching: false, loaded: true }, payload);
        let matched = false;
        lists = _.map(lists, (list) => {
            if (!matched && select_list_1.matchList(list, payload)) {
                matched = true;
                let results = list.results || [];
                list = immutable_1.default.merge(list, data);
                if (payload.page !== 1) {
                    results = results.concat(payload.results);
                }
                let map = _.keyBy(results, 'id');
                list = immutable_1.default.merge(list, { results, map });
            }
            return list;
        });
        if (!matched) {
            let list = immutable_1.default.merge(EMPTY_LIST, data);
            let map = _.keyBy(list.results, 'id');
            list = immutable_1.default.set(list, 'map', map);
            lists = lists.concat(list);
        }
        return immutable_1.default.set(state, model, lists);
    },
    LOAD_LIST_FAILURE: (state, action) => {
        const payload = action.payload;
        return immutable_1.default.set(state, payload.model, applyListData(state[payload.model], payload, { error: payload.error, fetching: false, loaded: false }));
    },
    APPLY_DETAIL: (state, action) => {
        const payload = action.payload;
        let { model, data } = payload;
        if (!_.isArray(data))
            return state;
        let lists = state[model];
        if (!lists)
            return state;
        return immutable_1.default.set(state, model, applyDetailsData(lists, data));
    },
    BATCH_APPLY_DETAILS: (state, action) => {
        const payload = action.payload;
        if (_.isArray(payload)) {
            _.forEach(payload, ({ model, data }) => {
                let lists = state[model];
                if (!lists)
                    return;
                state = immutable_1.default.set(state, model, applyDetailsData(lists, data));
            });
        }
        return state;
    },
    LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);
function generateListApiUrl(params) {
    return params.limit === -1 ? params.model : `${params.model}/paginate`;
}
function* listSaga({ payload }) {
    try {
        let search = payload.search || '';
        let sort = payload.sort || '';
        let limit = payload.limit || 0;
        let fn = app_1.default.defaults.generateListApiUrl || generateListApiUrl;
        let url = fn({ model: payload.model, limit, filters: payload.filters });
        let query = _.assign({
            _search: search,
            _sort: sort
        }, payload.filters);
        if (limit !== -1) {
            query._limit = limit;
            query._page = payload.page || 1;
        }
        let res = yield akita_1.default.get(url, { query });
        if (limit === -1) {
            res = {
                results: res,
                total: res.length,
            };
        }
        res.search = search;
        res.filters = payload.filters || null;
        res.sort = sort;
        res.limit = limit;
        yield effects_1.put(exports.applyList(payload.model, res));
    }
    catch (e) {
        yield effects_1.put(exports.loadListFailure(payload.model, e));
    }
}
exports.listSaga = listSaga;
function* moreSaga({ payload }) {
    let list = payload.list;
    if (!list)
        return;
    try {
        let search = list.search || '';
        let sort = list.sort || '';
        let limit = list.limit || 0;
        let fn = app_1.default.defaults.generateListApiUrl || generateListApiUrl;
        let url = fn({ model: payload.model, limit, filters: list.filters });
        let res = yield akita_1.default.get(url, {
            query: _.assign({
                _model: payload.model,
                _search: search,
                _limit: limit,
                _page: list.page + 1,
                _sort: sort
            }, list.filters)
        });
        _.forEach(res.results, (data) => {
            data.rev = Date.now();
        });
        res.search = search;
        res.filters = list.filters || null;
        res.sort = sort;
        res.limit = limit;
        yield effects_1.put(exports.applyList(payload.model, res));
    }
    catch (e) {
        yield effects_1.put(exports.loadListFailure(payload.model, e));
    }
}
exports.moreSaga = moreSaga;
