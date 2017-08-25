import { StoreState } from '../types/StoreState';
import { SETTINGS } from '../constants';

export const defaultState: StoreState = {
	title: SETTINGS,
	connection: {
		active: false,
		channelName: '',
		userName: '',
		encryptionKey: '',
		status: '',
		alert: false,
		validity: {
			channel: true,
			name: true,
			key: true,
		}
	},
	messages: {
		items: [],
		newMessage: '',
	}
};