import { Response, Request } from "express";

import { channels } from '../models/channels';
import io from '../server';

let lastMessageId = 1;

export function getEncryptedPhrase(req: Request, res: Response) {
	const channel = req.params.channel as string;
	if (!channels.has(channel)) {
		return res.status(404).json({ message: `Channel "${channel}" does not exist. To create a channel do "POST /api/channels/:channel".` });
	}
	return res.json({ encryptedPhrase: channels.get(channel).encryptedPhrase });
}

export function postEncryptedPhrase(req: Request, res: Response) {
	const channel = req.params.channel as string;
	if (!/^[a-zA-Z0-9]{1,12}$/.test(channel)) {
		return res.status(422).json({ type: 'VALIDATION_ERROR', channelNameErrorMessage: 'channel name invalid' });
	}
	if (channels.has(channel)) {
		return res.json({ encryptedPhrase: channels.get(channel).encryptedPhrase });
	}
	const encryptedPhrase = req.body.encryptedPhrase as string;
	if (!encryptedPhrase) {
		return res.status(422).json({ message: 'encryptedPhrase is required in body' });
	}
	channels.set(channel, { encryptedPhrase, users: new Map() });

	const namespace = io.of(`/${channel}`);
	namespace.on('connection', function(socket) {
		socket.on('message', (message) => {
			message.id = lastMessageId++;
			message.timestamp = Date.now();
			namespace.emit('message', message);
		});
	});

	return res.json({ encryptedPhrase });
}
