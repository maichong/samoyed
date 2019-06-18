import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import { ApplyDevicePayload } from '.';

export default handleActions({
  APPLY_DEVICE: (state, action) => {
    // @ts-ignore
    let payload: ApplyDevicePayload = action.payload;
    if (!payload.pages) return state;
    return {
      list: payload.pages,
      map: _.keyBy(payload.pages, 'id')
    };
  }
}, {});
