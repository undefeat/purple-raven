import { User } from './User';

export interface Channel {
	name: string;
	encryptedPhrase: string;
	users: User[];
}
