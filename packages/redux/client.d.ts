import { ReduxCompatibleReducer } from 'redux-actions';
import { ClientState } from '.';

declare const reducer: ReduxCompatibleReducer<ClientState, any>;

export default reducer;
