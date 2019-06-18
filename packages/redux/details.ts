import * as _ from 'lodash';
import { createAction, handleActions, Action } from 'redux-actions';
import api from 'akita';
import app from '@samoyed/app';
import immutable from '@samoyed/utils/immutable';
import { ObjectMap } from '@samoyed/types';
import {
  Record,
  RecordMap,
  DetailsState,
  ClearDetailsPayload,
  LoadDetailPayload,
  ApplyDetailPayload,
  GenerateDetailApiParams
} from '.';

const LOAD_DETAIL = 'LOAD_DETAIL';
const APPLY_DETAIL = 'APPLY_DETAIL';
const BATCH_APPLY_DETAILS = 'BATCH_APPLY_DETAILS';
const CLEAR_DETAILS = 'CLEAR_DETAILS';
const BATCH_CLEAR_DETAILS = 'BATCH_CLEAR_DETAILS';

/**
 * 清除详情
 * @param {Object}   item
 * @param {string}   item.model
 * @param {string[]} [item.ids]
 */
export const clearDetails = createAction<ClearDetailsPayload>(CLEAR_DETAILS);

/**
 * 批量清除详情
 * @param {Array<{model:string, ids:string[]}>} list
 */
export const batchClearDetails = createAction<ClearDetailsPayload[]>(BATCH_CLEAR_DETAILS);

/**
 * 加载详情
 * @param {Object} item
 * @param {string} item.model
 * @param {string} item.id
 */
export const loadDetail = createAction<LoadDetailPayload>(LOAD_DETAIL);

/**
 * 成功获得详情数据
 * @param {Object} item
 * @param {string} item.model
 * @param {Object} item.data
 * @param {number} [item.rev]
 */
export const applyDetail = createAction<ApplyDetailPayload>(APPLY_DETAIL);

/**
 * 批量更新详情数据
 * @param {Array<{model:string, data:Object}>} list
 */
export const batchApplyDetails = createAction<ApplyDetailPayload[]>(BATCH_APPLY_DETAILS);

app.addAction('clearDetails', clearDetails);
app.addAction('batchClearDetails', batchClearDetails);
app.addAction('loadDetail', loadDetail);
app.addAction('applyDetail', applyDetail);

// 初始state
const INITIAL_STATE: DetailsState = {};
const EMPTY_RECORD: Record = {
  id: '',
  error: null,
  fetching: false,
  loaded: false,
  rev: 0
};

export default handleActions({
  REFRESH: () => INITIAL_STATE,
  CLEAR_DETAILS: (state: DetailsState, action) => {
    // @ts-ignore
    const payload: ClearDetailsPayload = action.payload;
    const { model, ids } = payload;
    if (!ids) {
      return immutable.without(state, model);
    }
    let map: RecordMap = state[model];
    if (!map) return state;
    map = immutable.without(map, ids);
    return immutable.set(state, model, map);
  },
  BATCH_CLEAR_DETAILS: (state: DetailsState, action) => {
    // @ts-ignore
    const payload: ClearDetailsPayload[] = action.payload;
    payload.forEach(({ model, ids }) => {
      if (ids) {
        let map: RecordMap = state[model];
        if (map) {
          map = immutable.without(map, ids);
          state = immutable.set(state, model, map);
        }
      } else {
        state = immutable.without(state, model);
      }
    });
    return state;
  },
  LOAD_DETAIL: (state: DetailsState, action) => {
    // @ts-ignore
    let payload: LoadDetailPayload = action.payload;
    let map = state[payload.model] || {};
    let record = map[payload.id] || _.clone(EMPTY_RECORD);
    record = immutable.merge(record, { fetching: true, error: null });
    map = immutable.set(map, payload.id, record);
    return immutable.set(state, payload.model, map);
  },
  APPLY_DETAIL: (state: DetailsState, action) => {
    // @ts-ignore
    const payload: ApplyDetailPayload = action.payload;
    let { model, data } = payload;
    let map: RecordMap = state[model] || {};

    let record: Record = map[data.id] || EMPTY_RECORD;
    let rev = data.rev || Date.now();
    record = _.defaults({ fecting: false, error: data.error, loaded: !data.error, rev }, data, record);

    map = immutable.set(map, data.id, record);
    return immutable.set(state, model, map);
  },
  BATCH_APPLY_DETAILS: (state: DetailsState, action) => {
    // @ts-ignore
    const payload: ApplyDetailPayload[] = action.payload;
    for (let { model, data } of payload) {
      let map: RecordMap = state[model] || {};

      let record: Record = map[data.id] || EMPTY_RECORD;
      let rev = data.rev || Date.now();
      record = _.defaults({ fecting: false, error: data.error, loaded: !data.error, rev }, data, record);

      map = immutable.set(map, data.id, record);
      state = immutable.set(state, model, map);
    }
    return state;
  },
  LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);

const fetching: ObjectMap<boolean> = {};
let queue: ApplyDetailPayload[] = [];
let timer: number = 0;

function generateDetailApiUrl(params: GenerateDetailApiParams) {
  return `${params.model}/${params.id}`;
}

export function* detailSaga({ payload }: Action<LoadDetailPayload>) {
  let fn = app.defaults.generateDetailApiUrl || generateDetailApiUrl;
  let url = fn({ model: payload.model, id: payload.id });
  try {
    if (fetching[url]) {
      return;
    }
    fetching[url] = true;
    let res = yield api.get(url);
    fetching[url] = false;
    queue.push({ model: payload.model, data: res });
  } catch (e) {
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
        app.store.dispatch(batchApplyDetails(cur));
      }
    }, 50);
  }
}
