import * as _ from 'lodash';
import { createAction, handleActions, Action } from 'redux-actions';
import { put } from 'redux-saga/effects';
import app from '@samoyed/app';
import immutable from '@samoyed/utils/immutable';
import api from 'akita';
import { ListSelector } from '@samoyed/utils';
import { matchList } from '@samoyed/utils/select-list';
import {
  RecordList,
  RecordListArray,
  ListsState,
  ApplyDetailPayload,
  ClearListPayload,
  LoadListPayload,
  LoadMorePayload,
  ApplyListPayload,
  GenerateListApiParams
} from '.';

const CLEAR_LIST = 'CLEAR_LIST';
const LOAD_LIST = 'LOAD_LIST';
const LOAD_MORE = 'LOAD_MORE';
const APPLY_LIST = 'APPLY_LIST';
const LOAD_LIST_FAILURE = 'LOAD_LIST_FAILURE';

/**
 * 清空列表 options
 * @params {string} [options.model] 要清空的列表model，空代表清空全部
 */
export const clearList = createAction<ClearListPayload>(CLEAR_LIST);

/**
 * 加载列表
 * @param {Object} options
 * @param {string} options.model
 * @param {number} options.page
 * @param {Object} options.filters
 * @param {string} options.search
 * @param {string} options.sort
 */
export const loadList = createAction<LoadListPayload, LoadListPayload>(LOAD_LIST, (req: LoadListPayload) => _.assign(req, {
  limit: req.limit || app.defaults.listLimit,
  search: req.search || '',
  sort: req.sort || '',
  filters: !req.filters || _.isEmpty(req.filters) ? null : req.filters,
  populations: !req.populations || _.isEmpty(req.populations) ? null : req.populations,
}));

/**
 * 加载更多
 * @param {Object} options
 * @param {string} options.model
 */
export const loadMore = createAction<LoadMorePayload>(LOAD_MORE);

/**
 * 加载成功
 * @param {string} model
 * @param {Object} res
 */
export const applyList = createAction<ApplyListPayload, string, ApplyListPayload>(APPLY_LIST, (model, res) => _.assign({ model }, res));

/**
 * 加载失败
 * @param {string} model
 * @param {Error} error
 */
export const loadListFailure = createAction(LOAD_LIST_FAILURE, (model: string, error: Error) => ({ model, error }));

app.addAction('clearList', clearList);
app.addAction('loadList', loadList);
app.addAction('loadMore', loadMore);
app.addAction('applyList', applyList);

// 初始state
const INITIAL_STATE: ListsState = {};

const EMPTY_LISTS: RecordListArray = [];

const EMPTY_LIST: RecordList = {
  // request
  model: '',
  search: '',
  sort: '',
  filters: null,
  populations: null,
  limit: 0,

  // status
  error: null,
  fetching: false,
  loaded: false,
  rev: 0,

  // result
  total: 0,
  page: 1,
  totalPage: 1,
  previous: 0,
  next: 0,
  results: [],
  map: {}
};

/**
 * 更新list数据，data中不带results数据，所以不用更新map和页数
 */
function applyListData(lists: RecordListArray, selector: ListSelector, data: any): RecordListArray {
  lists = lists || EMPTY_LISTS;
  let matched = false;
  lists = _.map(lists, (list: RecordList) => {
    if (!matched && matchList(list, selector)) {
      // matched
      list = immutable.merge(list, data);
      matched = true;
    }
    return list;
  });
  if (!matched) {
    lists = lists.concat([immutable.merge(EMPTY_LIST, data)]) as RecordListArray;
  }
  return lists;
}

function applyDetailsData(lists: RecordListArray, data: any): RecordListArray {
  return _.map(lists, (list) => {
    let found = false;
    let results = _.map(list.results, (record) => {
      if (record.id === data.id) {
        found = true;
        return immutable.merge(record, data);
      }
      return record;
    });
    if (found) {
      let map = immutable.set(list.map, data.id, data);
      list = immutable.merge(list, { results, map });
    }
    return list;
  });
}

export default handleActions({
  REFRESH: () => INITIAL_STATE,
  LOAD_LIST: (state, action) => {
    // @ts-ignore
    const payload: LoadListPayload = action.payload;
    return immutable.set(state, payload.model, applyListData(
      state[payload.model],
      payload,
      _.defaults({ fetching: true }, payload)
    ));
  },
  LOAD_MORE: (state, action) => {
    // @ts-ignore
    const payload: LoadMorePayload = action.payload;
    return immutable.set(state, payload.model, applyListData(
      state[payload.model],
      payload.list,
      { fetching: true }
    ));
  },
  CLEAR_LIST: (state, action) => {
    // @ts-ignore
    const payload: ClearListPayload = action.payload;
    return payload.model ? immutable.without(state, payload.model) : INITIAL_STATE;
  },
  APPLY_LIST: (state, action) => {
    // @ts-ignore
    const payload: ApplyListPayload = action.payload;
    let model = payload.model;
    let lists: RecordListArray = state[payload.model] || EMPTY_LISTS;

    let data = _.defaults({ error: null, fetching: false, loaded: true }, payload);
    let matched = false;
    lists = _.map(lists, (list) => {
      if (!matched && matchList(list, payload)) {
        // matched
        matched = true;
        let results = list.results || [];
        list = immutable.merge(list, data);
        if (payload.page !== 1) {
          results = results.concat(payload.results);
        }
        let map = _.keyBy(results, 'id');
        list = immutable.merge(list, { results, map });
      }
      return list;
    });
    if (!matched) {
      let list = immutable.merge(EMPTY_LIST, data);
      let map = _.keyBy(list.results, 'id');
      list = immutable.set(list, 'map', map);
      lists = lists.concat(list) as RecordListArray;
    }

    return immutable.set(state, model, lists);
  },
  LOAD_LIST_FAILURE: (state, action) => {
    // @ts-ignore
    const payload: LoadListFailurePayload = action.payload;
    return immutable.set(state, payload.model, applyListData(
      state[payload.model],
      payload,
      { error: payload.error, fetching: false, loaded: false }
    ));
  },
  APPLY_DETAIL: (state, action) => {
    // @ts-ignore
    const payload: ApplyDetailPayload = action.payload;
    let { model, data } = payload;
    if (!_.isArray(data)) return state;
    let lists: RecordListArray = state[model];
    if (!lists) return state;

    return immutable.set(state, model, applyDetailsData(lists, data));
  },
  BATCH_APPLY_DETAILS: (state, action) => {
    // @ts-ignore
    const payload: ApplyDetailPayload[] = action.payload;

    if (_.isArray(payload)) {
      _.forEach(payload, ({ model, data }) => {
        let lists: RecordListArray = state[model];
        if (!lists) return;
        state = immutable.set(state, model, applyDetailsData(lists, data));
      });
    }

    return state;
  },
  LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);

function generateListApiUrl(params: GenerateListApiParams) {
  return params.limit === -1 ? params.model : `${params.model}/paginate`;
}

export function* listSaga({ payload }: Action<LoadListPayload>) {
  try {
    let search = payload.search || '';
    let sort = payload.sort || '';
    let limit = payload.limit || 0;
    let fn = app.defaults.generateListApiUrl || generateListApiUrl;
    let url = fn({ model: payload.model, limit, filters: payload.filters });

    let query = _.assign({
      _search: search,
      _sort: sort
    }, payload.filters);

    if (limit !== -1) {
      query._limit = limit;
      query._page = payload.page || 1;
    }

    let res = yield api.get(url, { query });

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
    yield put(applyList(payload.model, res));
  } catch (e) {
    yield put(loadListFailure(payload.model, e));
  }
}

export function* moreSaga({ payload }: Action<LoadMorePayload>) {
  let list: RecordList = payload.list;
  if (!list) return;
  try {
    let search = list.search || '';
    let sort = list.sort || '';
    let limit = list.limit || 0;

    let fn = app.defaults.generateListApiUrl || generateListApiUrl;
    let url = fn({ model: payload.model, limit, filters: list.filters });

    let res = yield api.get(
      url,
      {
        query: _.assign({
          _model: payload.model,
          _search: search,
          _limit: limit,
          _page: list.page + 1,
          _sort: sort
        }, list.filters)
      }
    );
    _.forEach(res.results, (data) => {
      data.rev = Date.now();
    });
    res.search = search;
    res.filters = list.filters || null;
    res.sort = sort;
    res.limit = limit;
    yield put(applyList(payload.model, res));
  } catch (e) {
    yield put(loadListFailure(payload.model, e));
  }
}
