"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const effects_1 = require("redux-saga/effects");
const redux_actions_1 = require("redux-actions");
const akita_1 = require("akita");
const app_1 = require("@samoyed/app");
const applyDevice = redux_actions_1.createAction('APPLY_DEVICE');
app_1.default.addAction('applyDevice', applyDevice);
function* deviceSaga() {
    let device = yield akita_1.default.post('device');
    yield effects_1.put(applyDevice(device));
}
exports.deviceSaga = deviceSaga;
