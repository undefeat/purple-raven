export interface Channel {
	name: string;
	encryptedPhrase: string;
	users: Array<{ username: string; token: string; }>;
}
