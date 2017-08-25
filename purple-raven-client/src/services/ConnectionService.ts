import * as io from 'socket.io-client';

import { generateEncryptedPhrase } from './EncryptionService';
import { generateRandomString } from '../helpers';
import { SERVER_URL, CHANNELS_API_URL, USERS_API_URL } from '../constants';

let socket: any;

async function registerUser(channel: string, name: string) {
	if (typeof(Storage) == 'undefined') {
		throw new Error('Your browser does not support localStorage, which is necessary for proper authentication.');
	}
	const token = localStorage.getItem('token');
	if (!token) {
		localStorage.setItem('token', generateRandomString(255));
	}
	const init = {
		method: 'POST',
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({
			user: name,
			token
		}),
	};
	const responseFromPostUser = await fetch(USERS_API_URL + channel, init);
	if (responseFromPostUser.ok) {
		return;
	} else if (responseFromPostUser.status === 422) {
		throw await responseFromPostUser.json();
	} else {
		throw new Error(`Error while trying to register a user: ${responseFromPostUser.status} ${responseFromPostUser.statusText}`);
	}
}

export async function fetchEncryptedPhrase(channel: string, name: string, key: string): Promise<string> {
	const responseFromGetEncryptedPhrase = await fetch(CHANNELS_API_URL + channel);
	switch (responseFromGetEncryptedPhrase.status) {
		case 200: {
			const body = await responseFromGetEncryptedPhrase.json();
			await registerUser(channel, name);
			return body.encryptedPhrase;
		}

		case 404: {
			const init = {
				method: 'POST',
				headers: new Headers({
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}),
				body: JSON.stringify({
					encryptedPhrase: generateEncryptedPhrase(key)
				}),
			};
			const responseFromPostEncryptedPhrase = await fetch(CHANNELS_API_URL + channel, init);

			switch (responseFromPostEncryptedPhrase.status) {
				case 200: {
					const body = await responseFromPostEncryptedPhrase.json();
					await registerUser(channel, name);
					return body.encryptedPhrase;
				}

				case 422: {
					throw await responseFromPostEncryptedPhrase.json();
				}

				default: {
					throw new Error(`Error while trying to get encrypted phrase: ${responseFromGetEncryptedPhrase.status} ${responseFromGetEncryptedPhrase.statusText}`);
				}
			}
		}

		case 422: {
			throw await responseFromGetEncryptedPhrase.json();
		}

		default: {
			throw new Error(`Error while trying to get encrypted phrase: ${responseFromGetEncryptedPhrase.status} ${responseFromGetEncryptedPhrase.statusText}`);
		}
	}
}

export function connect(channel: string) {
	socket = io(`${SERVER_URL}/${channel}`);
	return socket;
}

export function disconnect(channel: string) {
	if (socket) {
		socket.close();
	}
}

export function postMessage(channel: string, author: string, content: string) {
	const message = {
			channel,
			timestamp: Date.now(),
			author,
			content
	};
	socket.emit('message', message);
}
