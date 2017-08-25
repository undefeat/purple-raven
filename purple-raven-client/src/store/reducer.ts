import { combineReducers } from 'redux';

import { StoreState } from '../types/StoreState';
import { titleReducer } from './title/reducer';
import { connectionReducer } from './connection/reducer';
import { messagesReducer } from './messages/reducer';

export default combineReducers<StoreState>({
	title: titleReducer,
	connection: connectionReducer,
	messages: messagesReducer
});