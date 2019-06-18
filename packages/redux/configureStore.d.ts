import { Reducer } from 'redux';
import { Saga } from '@redux-saga/types';
import { Store } from '.';

export default function configureStore(rootReducer: Reducer, rootSaga: Saga): Store;
