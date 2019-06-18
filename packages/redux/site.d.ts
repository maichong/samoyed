import { ReduxCompatibleReducer } from 'redux-actions';
import { SiteState } from '.';

declare const reducer: ReduxCompatibleReducer<SiteState, any>;

export default reducer;
