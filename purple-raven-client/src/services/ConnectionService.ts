import * as io from 'socket.io-client';

import { generateEncryptedPhrase } from './EncryptionService';
import { generateRandomString } from '../helpers';
import { SERVER_URL, CHANNELS_API_URL, AUTO_MESSAGE_AUTHOR } from '../constants';

let socket: SocketIOClient.Socket;

function handleUnexpectedResponse(res: Response) {
	throw new Error(`Response from GET ${res.url} has unexpected status "${res.status} ${res.statusText}"`);
}

async function channelExists(channel: string): Promise<boolean> {
	const url = `${CHANNELS_API_URL}/${channel}?exists`;
	const response = await fetch(url);
	if (!response.ok) {
		handleUnexpectedResponse(response);
	}
	const { exists } = await response.json();
	return exists;
}

async function getEncryptedPhrase(channel: string): Promise<string> {
	const url = `${CHANNELS_API_URL}/${channel}?encryptedPhrase`;
	const response = await fetch(url);
	if (!response.ok) {
		handleUnexpectedResponse(response);
	}
	const { encryptedPhrase } = await response.json();
	return encryptedPhrase;
}

async function createChannel(channel: string, encryptedPhrase: string): Promise<void> {
	const url = `${CHANNELS_API_URL}/${channel}?encryptedPhrase`;
	const init = {
		method: 'POST',
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({ encryptedPhrase }),
	};
	const response = await fetch(url, init);
	switch (response.status) {
		case 201: return;
		case 422: throw await response.json();
		default: handleUnexpectedResponse(response);
	}
}

async function usernameExists(channel: string, username: string): Promise<boolean> {
	const url = `${CHANNELS_API_URL}/${channel}/users/${username}?exists`;
	const response = await fetch(url);
	if (!response.ok) {
		handleUnexpectedResponse(response);
	}
	const { exists } = await response.json();
	return exists;
}

async function verifyToken(channel: string, username: string, token: string): Promise<boolean> {
	const url = `${CHANNELS_API_URL}/${channel}/users/${username}?verifyToken`;
	const init = {
		method: 'POST',
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({ token }),
	};
	const response = await fetch(url, init);
	if (!response.ok) {
		handleUnexpectedResponse(response);
	}
	const { tokenVerified } = await response.json();
	return tokenVerified;
}

async function createUser(channel: string, username: string, token: string): Promise<void> {
	const url = `${CHANNELS_API_URL}/${channel}/users/${username}`;
	const init = {
		method: 'POST',
		headers: new Headers({
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify({ token }),
	};
	const response = await fetch(url, init);
	switch (response.status) {
		case 201: saveToken(username, token); return;
		case 422: throw await response.json();
		default: handleUnexpectedResponse(response);
	}
}

function validateKey(key: string) {
	let message;
	if (key.length < 8) {
		message = 'Encryption key is too short';
	}
	if (key.length > 16) {
		message = 'Encryption key is too long';
	}
	if (!/^[a-zA-Z0-9]+$/.test(key)) {
		message = 'Encryption key contains invalid characters';
	}
	if (message) {
		throw {
			validationError: true,
			fieldName: 'encryptionKey',
			constraints: 'Valid characters: letters a-zA-Z, digits, no spaces. Minimum length - 8. Maximum length - 16.',
			message
		};
	}
}

function validateUsername(username: string) {
	if (username.toLowerCase() === AUTO_MESSAGE_AUTHOR.toLowerCase()) {
		throw {
			validationError: true,
			fieldName: 'username',
			message: `Username "${AUTO_MESSAGE_AUTHOR}" is reserved`
		};
	}
}

function fetchToken(username: string) {
	return localStorage.getItem(`${username}-token`);
}

function saveToken(username: string, token: string) {
	return localStorage.setItem(`${username}-token`, token);
}

export async function fetchEncryptedPhrase(channel: string, username: string, key: string): Promise<string> {
	validateUsername(username);
	if (await channelExists(channel)) {
		const encryptedPhrase = await getEncryptedPhrase(channel);
		if (await usernameExists(channel, username)) {
			const token = fetchToken(username);
			let tokenVerified = token ? await verifyToken(channel, username, token) : false;
			if (!tokenVerified) {
				throw {
					validationError: true,
					fieldName: 'username',
					message: 'Could not verify username. Please try another one.'
				};
			}
		} else {
			await createUser(channel, username, generateRandomString(255));
		}
		return encryptedPhrase;
	} else {
		validateKey(key);
		const encryptedPhrase = generateEncryptedPhrase(key);
		await createChannel(channel, encryptedPhrase);
		return encryptedPhrase;
	}
}

export function connect(channel: string, username: string) {
	socket = io(`${SERVER_URL}/${channel}?username=${username}`);
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
			author,
			content
	};
	socket.emit('message', message);
}
