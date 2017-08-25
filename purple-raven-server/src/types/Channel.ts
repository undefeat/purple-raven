export interface Channel {
	encryptedPhrase: string;
	users: Map<string, string>;
}