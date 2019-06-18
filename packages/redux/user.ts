import * as _ from 'lodash';
import { createAction, handleActions } from 'redux-actions';
import immutable from '@samoyed/utils/immutable';
import app from '@samoyed/app';
import { User, ApplyDevicePayload } from '.';

const APPLY_USER = 'APPLY_USER';

export const applyUser = createAction<User>(APPLY_USER);

app.addAction('applyUser', applyUser);

// @ts-ignore 初始state
const INITIAL_STATE: User = {
  id: '',
  displayName: '',
  avatar: ''
};

export default handleActions({
  APPLY_DEVICE: (state, action) => {
    // @ts-ignore
    let payload: ApplyDevicePayload = action.payload;
    if (payload.user) return payload.user;
    return state;
  },
  APPLY_USER: (state, action) => {
    // @ts-ignore
    let user: User = action.payload;
    if (_.isEqual(state, user)) {
      return state;
    }
    return immutable.merge(state, user);
  },
  LOGOUT: () => INITIAL_STATE
}, INITIAL_STATE);
