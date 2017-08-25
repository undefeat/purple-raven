import { Dispatch } from 'react-redux';

import * as ConnectionS from '../services/ConnectionService';
import * as EncryptionS from '../services/EncryptionService';
import { StoreState } from '../types/StoreState';
import { Message } from '../types/Message';
import { VALIDATION_ERROR, CHANNEL_FIELD, NAME_FIELD, KEY_FIELD } from '../constants';
import {
	connectionSetActive,
	connectionSetDetails,
	connectionSetStatus,
	connectionClearStatus,
	connectionInvalidateField,
	connectionValidateAllFields
} from './connection/actions';
import { messageAdd, messagesSetNew, messagesClear } from './messages/actions';
import { titleSet } from './title/actions';

export function establishConnection(channel: string, name: string, key: string) {
	return (dispatch: Dispatch<any>, getState: () => StoreState) => {

		async function doDisconnect() {
			return await ConnectionS.disconnect(channel);
		}

		async function doConnect() {
			try {
				const socket = await ConnectionS.connect(channel);
				socket.on('message', (data: Message) => {
					data.author = EncryptionS.decrypt(data.author, key);
					data.content = EncryptionS.decrypt(data.content, key);
					dispatch(messageAdd(data));
				});
				dispatch(connectionSetActive());
				dispatch(connectionSetDetails(channel, name, key));
				dispatch(titleSet('@' + channel));
				dispatch(connectionClearStatus());
			} catch (e) {
				dispatch(
					connectionSetStatus('Connection could not be established. Please try again next time.', true)
				);
			}
		}

		function handleConnectionError(error: any) {
			if ('type' in error && error.type === VALIDATION_ERROR) {
				const channelNameErrorMessage: string = error.channelNameErrorMessage;
				const yourNameErrorMessage: string = error.yourNameErrorMessage;
				let status = 'Validation errors: ';
				if (channelNameErrorMessage) {
					status += channelNameErrorMessage;
					dispatch(connectionInvalidateField(CHANNEL_FIELD));
				}
				if (yourNameErrorMessage) {
					status += (channelNameErrorMessage ? ', ' : '') + yourNameErrorMessage;
					dispatch(connectionInvalidateField(NAME_FIELD));
				}
				dispatch(connectionSetStatus(status, true));
			} else {
				throw new Error(error);
			}
		}

		dispatch(connectionSetStatus('Connecting ...'));
		ConnectionS.fetchEncryptedPhrase(channel, name, key)
			.then(encryptedPhrase => {
				if (EncryptionS.canBeDecrypted(encryptedPhrase, key)) {
					dispatch(connectionValidateAllFields());
					dispatch(connectionSetStatus('Credentials valid.'));
					if (getState().connection.channelName !== channel) {
						dispatch(messagesClear());
						doDisconnect().then(doConnect);
					} else {
						doConnect();
					}
				} else {
					dispatch(connectionInvalidateField(KEY_FIELD));
					dispatch(connectionSetStatus('Invalid Encryption Key.', true));
				}
			})
			.catch(handleConnectionError);
	};
}

export function sendMessage() {
	return (dispatch: Dispatch<any>, getState: () => StoreState) => {
		const channel = getState().connection.channelName;
		const author = getState().connection.userName;
		const content = getState().messages.newMessage;

		const key = getState().connection.encryptionKey;
		const encryptedAuthor = EncryptionS.encrypt(author, key).toString();
		const encryptedContent = EncryptionS.encrypt(content, key).toString();

		ConnectionS.postMessage(channel, encryptedAuthor, encryptedContent);
		dispatch(messagesSetNew(''));
	};
}

export function showMessageList() {
	return (dispatch: Dispatch<any>, getState: () => StoreState) => {
		dispatch(titleSet('@' + getState().connection.channelName));
	};
}