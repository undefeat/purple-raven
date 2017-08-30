export interface Message {
	id: string;
	timestamp: number;
	content: string;
	author: string;
	channel: string;
	isConnectionMessage?: boolean;
}
