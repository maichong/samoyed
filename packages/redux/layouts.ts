import * as _ from 'lodash';
import { handleActions } from 'redux-actions';
import { ApplyDevicePayload } from '.';

export default handleActions({
  APPLY_DEVICE: (state, action) => {
    // @ts-ignore
    let payload: ApplyDevicePayload = action.payload;
    if (!payload.layouts) return state;
    return {
      list: payload.layouts,
      map: _.keyBy(payload.layouts, 'id')
    };
  }
}, {});
