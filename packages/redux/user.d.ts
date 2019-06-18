import { ReduxCompatibleReducer, ActionFunction1, Action } from 'redux-actions';
import { UserState } from '.';

export const applyUser: ActionFunction1<Partial<UserState>, Action<Partial<UserState>>>;

declare const reducer: ReduxCompatibleReducer<UserState, any>;

export default reducer;
