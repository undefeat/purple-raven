import { AES, enc } from 'crypto-js';

import { generateRandomString } from '../helpers';
import { RANDOM_STRING_LENGTH } from '../constants';

export function generateEncryptedPhrase(key: string) {
	return encrypt(generateRandomString(RANDOM_STRING_LENGTH), key).toString();
}

export function canBeDecrypted(str: string, key: string) {
	let decryptedPhrase;
	try {
		decryptedPhrase = AES.decrypt(str, key).toString(enc.Utf8);
		return decryptedPhrase.length === RANDOM_STRING_LENGTH;
	} catch (e) {
		return false;
	}
}

export function encrypt(str: string, key: string) {
	return AES.encrypt(str, key);
}

export function decrypt(str: string, key: string) {
	return AES.decrypt(str, key).toString(enc.Utf8);
}