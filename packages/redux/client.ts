import { handleActions } from 'redux-actions';
import { ApplyDevicePayload } from '.';

export default handleActions({
  APPLY_DEVICE: (state, action) => {
    // @ts-ignore
    let payload: ApplyDevicePayload = action.payload;
    if (payload.client) return payload.client;
    return state;
  }
}, null);
