import { put } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import api from 'akita';
import app from '@samoyed/app';
import { ApplyDevicePayload } from '.';

const applyDevice = createAction<ApplyDevicePayload>('APPLY_DEVICE');

app.addAction('applyDevice', applyDevice);

export function* deviceSaga() {
  let device = yield api.post('device');

  yield put(applyDevice(device));
}
