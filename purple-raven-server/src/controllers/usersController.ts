import { Response, Request } from "express";

import { channels } from '../models/channels';

export function postUser(req: Request, res: Response) {
	const channel = req.params.channel as string;
	if (!channels.has(channel)) {
		return res.status(404).json({ message: `Channel "${channel}" does not exist. To create a channel do "POST /api/channels/:channel".` });
	}
	const user = req.body.user as string;
	const token = req.body.token as string;
	if (!user) {
		return res.status(422).json({ type: 'VALIDATION_ERROR', yourNameErrorMessage: `user is required in body` });
	}
	if (channels.get(channel).users.has(user)) {
		const userToken = channels.get(channel).users.get(user);
		if (!token || token !== userToken) {
			return res.status(422).json({ type: 'VALIDATION_ERROR', yourNameErrorMessage: `user with a name "${user}" already exists` });
		}
	} else {
		if (!/^[a-zA-Z0-9]{1,9}$/.test(user)) {
			return res.status(422).json({ type: 'VALIDATION_ERROR', yourNameErrorMessage: 'username invalid' });
		}
	}
	channels.get(channel).users.set(user, token);
	return res.status(200).json();
}