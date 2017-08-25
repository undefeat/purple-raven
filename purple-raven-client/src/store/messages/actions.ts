import { MESSAGE_ADD, MESSAGE_REMOVE, MESSAGES_SET_NEW, MESSAGES_CLEAR } from './constants';
import { Message } from '../../types/Message';

export interface MessageAddAction {
	type: MESSAGE_ADD;
	message: Message;
}

export interface MessageRemoveAction {
	type: MESSAGE_REMOVE;
	id: string;
}

export interface MessagesSetNewAction {
	type: MESSAGES_SET_NEW;
	content: string;
}

export interface MessagesClearAction {
	type: MESSAGES_CLEAR;
}

export type MessagesAction = MessageAddAction | MessageRemoveAction | MessagesSetNewAction | MessagesClearAction;

export function messageAdd(message: Message): MessageAddAction {
	return {
		type: MESSAGE_ADD,
		message
	};
}

export function messageRemove(id: string): MessageRemoveAction {
	return {
		type: MESSAGE_REMOVE,
		id
	};
}

export function messagesSetNew(content: string): MessagesSetNewAction {
	return {
		type: MESSAGES_SET_NEW,
		content
	};
}

export function messagesClear(): MessagesClearAction {
	return {
		type: MESSAGES_CLEAR
	};
}