import { Dispatch } from 'react-redux';

import * as ConnectionS from '../services/ConnectionService';
import * as EncryptionS from '../services/EncryptionService';
import { StoreState } from '../types/StoreState';
import { Message } from '../types/Message';
import { SocketConnectionMessage } from '../types/SocketConnectionMessage';
import { ValidationError } from '../types/ValidationError';
import { CHANNEL_FIELD, NAME_FIELD, KEY_FIELD, SETTINGS, AUTO_MESSAGE_AUTHOR } from '../constants';
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
import { Action } from './';

export function establishConnection(channel: string, name: string, key: string) {
	return (dispatch: Dispatch<Action>, getState: () => StoreState) => {

		async function doDisconnect() {
			return await ConnectionS.disconnect(channel);
		}

		async function doConnect() {
			try {
				const socket = await ConnectionS.connect(channel, name);
				handleSocket(socket);
			} catch (e) {
				dispatch(
					connectionSetStatus('Connection could not be established. Please try again next time.', true)
				);
			}
		}

		function handleSocket(socket: SocketIOClient.Socket) {

			socket.on('message', (data: Message) => {
				data.author = EncryptionS.decrypt(data.author, key);
				data.content = EncryptionS.decrypt(data.content, key);
				dispatch(messageAdd(data));
			});

			socket.on('client-connect', (data: SocketConnectionMessage) => {
				if (socket.id !== data.socketId) {
					const connectionMessage: Message = {
						id: data.socketId + '#client-connect',
						timestamp: data.timestamp,
						author: AUTO_MESSAGE_AUTHOR,
						content: `${data.author} has joined`,
						channel,
						isConnectionMessage: true
					};
					dispatch(messageAdd(connectionMessage));
				}
			});

			socket.on('client-disconnect', (data: SocketConnectionMessage) => {
				if (socket.id !== data.socketId) {
					const connectionMessage: Message = {
						id: data.socketId + '#client-disconnect',
						timestamp: data.timestamp,
						author: AUTO_MESSAGE_AUTHOR,
						content: `${data.author} has left`,
						channel,
						isConnectionMessage: true
					};
					dispatch(messageAdd(connectionMessage));
				}
			});

			socket.on('connect', () => {
				dispatch(connectionSetDetails(channel, name, key));
				dispatch(connectionSetActive());
				dispatch(titleSet('@' + channel));
				dispatch(connectionClearStatus());
				dispatch(messagesClear());
			});

			socket.on('disconnect', () => {
				doDisconnect().then(() => {
					dispatch(connectionSetStatus('Disconnected', true));
					dispatch(connectionSetActive(false));
					dispatch(connectionValidateAllFields());
					dispatch(titleSet(SETTINGS));
					dispatch(messagesClear());
				});
			});
		}

		function handleConnectionError(error: ValidationError) {
			if (error.validationError) {
				let status = error.message;
				switch (error.fieldName) {
					case 'channelName': {
						dispatch(connectionInvalidateField(CHANNEL_FIELD));
						break;
					}
					case 'username': {
						dispatch(connectionInvalidateField(NAME_FIELD));
						break;
					}
					case 'encryptionKey': {
						dispatch(connectionInvalidateField(KEY_FIELD));
						break;
					}
					default: break;
				}
				dispatch(connectionSetStatus(status, true));
			} else {
				dispatch(connectionSetStatus('Oops! Something went wrong. Please try again later.', true));
			}
		}

		dispatch(connectionSetStatus('Connecting ...'));
		ConnectionS.fetchEncryptedPhrase(channel, name, key)
			.then(encryptedPhrase => {
				if (EncryptionS.canBeDecrypted(encryptedPhrase, key)) {
					dispatch(connectionValidateAllFields());
					dispatch(connectionSetStatus('Credentials valid.'));
					doDisconnect().then(doConnect);
				} else {
					dispatch(connectionInvalidateField(KEY_FIELD));
					dispatch(connectionSetStatus('Invalid Encryption Key.', true));
				}
			})
			.catch(handleConnectionError);
	};
}

export function sendMessage() {
	return (dispatch: Dispatch<Action>, getState: () => StoreState) => {
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
	return (dispatch: Dispatch<Action>, getState: () => StoreState) => {
		dispatch(titleSet('@' + getState().connection.channelName));
	};
}
