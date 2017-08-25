import { Connection } from './Connection';
import { MessagesState } from './MessagesState';

export interface StoreState {
	title: string;
	connection: Connection;
	messages: MessagesState;
}