import { Message } from './Message';

export interface MessagesState {
	items: Message[];
	newMessage: string;
}