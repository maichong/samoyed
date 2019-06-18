import { ReduxCompatibleReducer, ActionFunction1, Action } from 'redux-actions';
import { ClearListPayload, LoadListPayload, LoadMorePayload, ApplyListPayload, LoadListFailurePayload, ListsState } from '.';


/**
 * 清空列表 options
 * @params {string} [options.model] 要清空的列表model，空代表清空全部
 */
export const clearList: ActionFunction1<ClearListPayload, Action<ClearListPayload>>;

/**
 * 加载列表
 * @param {Object} options
 * @param {string} options.model
 * @param {number} options.page
 * @param {Object} options.filters
 * @param {string} options.search
 * @param {string} options.sort
 */
export const loadList: ActionFunction1<LoadListPayload, Action<LoadListPayload>>;

/**
 * 加载更多
 * @param {Object} options
 * @param {string} options.model
 */
export const loadMore: ActionFunction1<LoadMorePayload, Action<LoadMorePayload>>;

/**
 * 加载成功
 * @param {string} model
 * @param {Object} res
 */
export const applyList: ActionFunction1<ApplyListPayload, Action<ApplyListPayload>>;

/**
 * 加载失败
 * @param {string} model
 * @param {Error} error
 */
export const loadListFailure: ActionFunction1<LoadListFailurePayload, Action<LoadListFailurePayload>>;

declare const reducer: ReduxCompatibleReducer<ListsState, any>;

export default reducer;

export function listSaga(action: Action<LoadListPayload>): any;

export function moreSaga(action: Action<LoadMorePayload>): any;
