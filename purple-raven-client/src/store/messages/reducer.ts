import { MESSAGE_ADD, MESSAGE_REMOVE, MESSAGES_SET_NEW, MESSAGES_CLEAR } from './constants';
import { MessagesAction } from './actions';
import { MessagesState } from '../../types/MessagesState';
import { defaultState } from '../defaultState';

export function messagesReducer(state: MessagesState = defaultState.messages, action: MessagesAction): MessagesState {
	switch (action.type) {
		case MESSAGE_ADD:
			return { ...state, items: [ ...state.items, action.message ] };
		
		case MESSAGE_REMOVE:
			return { ...state, items: state.items.filter(item => item.id !== action.id) };

		case MESSAGES_SET_NEW:
			return { ...state, newMessage: action.content };

		case MESSAGES_CLEAR:
			return { ...state, items: [] };

		default:
			return state;
	}
}