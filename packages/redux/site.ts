import { handleActions } from 'redux-actions';
import { ApplyDevicePayload } from '.';

export default handleActions({
  APPLY_DEVICE: (state, action) => {
    // @ts-ignore
    let payload: ApplyDevicePayload = action.payload;
    if (payload.site) return payload.site;
    return state;
  }
}, null);
