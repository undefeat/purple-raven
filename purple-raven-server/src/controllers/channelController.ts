import { Response, Request, NextFunction } from "express";

import Channels from '../models/channels';
import { ioServer } from '../server';

/*
	GET /api/channels/:channelName?exists
	Content-Type: application/json
*/
export function checkIfChannelExists(req: Request, res: Response, next: NextFunction) {
	if ('exists' in req.query) {
		const channelName = req.params.channelName as string;
		const exists  = Channels.channelExists(channelName);
		res.json({ exists });
	} else {
		next();
	}
}

/*
	GET /api/channels/:channelName?encryptedPhrase
	Content-Type: application/json
*/
export function getEncryptedPhrase(req: Request, res: Response, next: NextFunction) {
	if ('encryptedPhrase' in req.query) {
		const channelName = req.params.channelName as string;
		const encryptedPhrase  = Channels.getEncryptedPhrase(channelName);
		if (encryptedPhrase === undefined) {
			res.status(404).json({ message: `Channel with the name "${channelName}" does not exist` });
		}
		res.json({ encryptedPhrase });
	} else {
		next();
	}
}

/*
	POST /api/channels/:channelName
	Content-Type: application/json
	{
		"encryptedPhrase": "xyz"
	}
*/
export function addChannel(req: Request, res: Response) {
	const channelName = req.params.channelName as string;
	const encryptedPhrase = req.body.encryptedPhrase as string;
	if (!encryptedPhrase) {
		res.status(400).json({
			message: 'Request body must contain a property "encryptedPhrase" with a value that is not an empty string'
		});
	}
	if (Channels.channelExists(channelName)) {
		res.status(409).json({ message: `Channel with the name "${channelName}" already exists` });
	}
	validateChannelName(channelName, res);
	try {
		Channels.addChannel(channelName, encryptedPhrase);
		createSocket(channelName);
		res.status(201).send();
	} catch (e) {
		console.error(e);
		res.status(500).send();
	}
}

function validateChannelName(channelName: string, res: Response) {
	let message;
	if (channelName.length > 12) {
		message = 'Channel name length is too large';
	}
	if (!/^[a-zA-Z0-9]+$/.test(channelName)) {
		message = 'Channel name contains invalid characters';
	}
	if (message) {
		res.status(422).json({
			validationError: true,
			fieldName: 'channelName',
			constraints: 'Valid characters: letters a-zA-Z, digits, no spaces. Maximum length - 12.',
			message
		});
	}
}

export let lastMessageId = 1;
export function createSocket(channelName: string) {
	const namespace = ioServer.of(`/${channelName}`);
	namespace.on('connection', (socket) => {
		socket.on('message', (message) => {
			message.id = lastMessageId++;
			namespace.emit('message', message);
		});
	});
}
