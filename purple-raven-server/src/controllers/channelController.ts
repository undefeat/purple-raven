import { Response, Request, NextFunction } from "express";

import Channels from '../models/channels';

export function checkIfChannelExists(req: Request, res: Response, next: NextFunction) {
	if ('exists' in req.query) {
		const channelName = req.params.channelName as string;
		const exists  = Channels.channelExists(channelName);
		res.json({ exists });
	} else {
		next();
	}
}

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

export function addChannel(req: Request, res: Response) {
	const channelName = req.params.channelName as string;
	const encryptedPhrase = req.body.encryptedPhrase as string;
	if (!encryptedPhrase) {
		return res.status(400).json({
			message: 'Request body must contain a property "encryptedPhrase" with a value that is not an empty string'
		});
	}
	if (Channels.channelExists(channelName)) {
		res.status(409).json({ message: `Channel with the name "${channelName}" already exists` });
	}
	validateChannelName(channelName, res);
	Channels.add(channelName, encryptedPhrase);
	res.status(201).send();
}

function validateChannelName(channelName: string, res: Response) {
	let message;
	if (channelName.length > 12) {
		message = 'Channel name length is too large';
	}
	if (!/^[a-zA-Z0-9]+$/.test(channelName)) {
		message = 'Channel name contains invalid characters';
	}
	console.log(channelName, message);
	if (message) {
		res.status(422).json({
			validationError: true,
			fieldName: 'channelName',
			constraints: 'Valid characters: letters a-zA-Z, digits, no spaces. Maximum length - 12.',
			message
		});
	}
}
