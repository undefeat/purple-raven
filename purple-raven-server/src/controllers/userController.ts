import { Response, Request, NextFunction } from "express";

import Channels from '../models/channels';

/*
	GET /api/channels/:channelName/users/:username?exists
	Content-Type: application/json
*/
export function checkIfUsernameExists(req: Request, res: Response, next: NextFunction) {
	if ('exists' in req.query) {
		const channelName = req.params.channelName as string;
		const username = req.params.username as string;
		const exists  = Channels.usernameExists(username, channelName);
		res.json({ exists });
	} else {
		next();
	}
}

/*
	POST /api/channels/:channelName/users/:username?verifyToken
	Content-Type: application/json
	{
		"token": "xyz"
	}
*/
export function verifyToken(req: Request, res: Response, next: NextFunction) {
	if ('verifyToken' in req.query) {
		const channelName = req.params.channelName as string;
		const username = req.params.username as string;
		const token = req.body.token as string;
		if (!Channels.channelExists(channelName)) {
			res.status(404).json({ message: `Channel with the name "${channelName}" does not exist` });
		}
		if (!Channels.usernameExists(username, channelName)) {
			res.status(404).json({ message: `User with the name "${username}" does not exist` });
		}
		if (!token) {
			res.status(400).json({
				message: 'Request body must contain a property "token" with a value that is not an empty string'
			});
		}
		const tokenVerified = Channels.tokenMatches(token, username, channelName);
		res.json({ tokenVerified });
	} else {
		next();
	}
}

/*
	POST /api/channels/:channelName/users/:username
	Content-Type: application/json
	{
		"token": "xyz"
	}
*/
export function addUser(req: Request, res: Response, next: NextFunction) {
	if (!('verifyToken' in req.query)) {
		const channelName = req.params.channelName as string;
		const username = req.params.username as string;
		const token = req.body.token as string;
		if (!Channels.channelExists(channelName)) {
			res.status(404).json({ message: `Channel with the name "${channelName}" does not exist` });
		}
		if (Channels.usernameExists(username, channelName)) {
			res.status(409).json({ message: `User with the name "${username}" already exists` });
		}
		if (!token) {
			res.status(400).json({
				message: 'Request body must contain a property "token" with a value that is not an empty string'
			});
		}
		validateUsername(username, res);
		try {
			Channels.addUsername(username, token, channelName);
			res.status(201).send();
		} catch (e) {
			console.error(e);
			res.status(500).send();
		}
	} else {
		next();
	}
}

function validateUsername(username: string, res: Response) {
	let message;
	if (username.length > 9) {
		message = 'Username length is too large';
	}
	if (!/^[a-zA-Z0-9']+$/.test(username)) {
		message = 'Username contains invalid characters';
	}
	if (message) {
		res.status(422).json({
			validationError: true,
			fieldName: 'username',
			constraints: 'Valid characters: letters a-zA-Z, single quote, digits, no spaces. Maximum length - 9.',
			message
		});
	}
}
