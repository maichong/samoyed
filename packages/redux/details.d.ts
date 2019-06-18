import { ReduxCompatibleReducer, ActionFunction1, Action } from 'redux-actions';
import { LoadDetailPayload, ClearDetailsPayload, ApplyDetailPayload, DetailsState } from '.';


/**
 * 清除详情
 * @param {Object}   item
 * @param {string}   item.model
 * @param {string[]} [item.ids]
 */
export const clearDetails: ActionFunction1<ClearDetailsPayload, Action<ClearDetailsPayload>>;

/**
 * 批量清除详情
 * @param {Array<{model:string, ids:string[]}>} list
 */
export const batchClearDetails: ActionFunction1<LoadDetailPayload[], Action<LoadDetailPayload[]>>;

/**
 * 加载详情
 * @param {Object} item
 * @param {string} item.model
 * @param {string} item.id
 */
export const loadDetail: ActionFunction1<LoadDetailPayload, Action<LoadDetailPayload>>;

/**
 * 成功获得详情数据
 * @param {Object} item
 * @param {string} item.model
 * @param {Object} item.data
 * @param {number} [item.rev]
 */
export const applyDetail: ActionFunction1<ApplyDetailPayload, Action<ApplyDetailPayload>>;

/**
 * 批量更新详情数据
 * @param {Array<{model:string, data:Object,rev?:number}>} list
 */
export const batchApplyDetails: ActionFunction1<ApplyDetailPayload[], Action<ApplyDetailPayload[]>>;


declare const reducer: ReduxCompatibleReducer<DetailsState, any>;

export default reducer;

export function detailsSaga(action: Action<LoadDetailPayload>): any;
