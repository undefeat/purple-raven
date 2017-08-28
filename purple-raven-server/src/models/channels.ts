import { Channel } from '../types/Channel';
import { User } from '../types/User';

class ChannelsModel {

	private channels: Channel[] = [];

	channelExists(channelName: string): boolean {
		return this.channels.find(ch => ch.name === channelName) !== undefined;
	}

	usernameExists(username: string, channelName: string): boolean {
		const channel = this.channels.find(ch => ch.name === channelName);
		if (channel === undefined) {
			return false;
		}
		return channel.users.find(user => user.username === username) !== undefined;
	}

	tokenMatches(token: string, username: string, channelName: string): boolean {
		const channel = this.channels.find(ch => ch.name === channelName) as Channel;
		const user = channel.users.find(user => user.username === username) as User;
		return user.token === token;
	}

	getEncryptedPhrase(channelName: string): string | undefined {
		const channel = this.channels.find(ch => ch.name === channelName);
		if (channel === undefined) {
			return;
		}
		return channel.encryptedPhrase;
	}

	addChannel(channelName: string, encryptedPhrase: string) {
		if (this.channels.find(ch => ch.name === channelName)) {
			throw new Error(`Channel with the name "${channelName}" already exists`);
		}
		this.channels.push({
			name: channelName,
			encryptedPhrase,
			users: []
		});
	}

	addUsername(username: string, token: string, channelName: string) {
		const channel = this.channels.find(ch => ch.name === channelName);
		if (channel === undefined) {
			throw new Error(`Channel with the name "${channelName}" does not exist`);
		}
		if (channel.users.find(user => user.username === username)) {
			throw new Error(`User with the name "${username}" already exists`);
		}
		channel.users.push({ username, token });
	}
}

export default new ChannelsModel();
