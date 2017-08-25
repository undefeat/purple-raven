import { Validity } from './Validity';

export interface Connection {
	active: boolean;
	channelName: string;
	userName: string;
	encryptionKey: string;
	status: string;
	alert: boolean;
	validity: Validity;
}