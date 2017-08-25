import { Channel } from '../types/Channel';

class ChannelsModel {

	private channels: Channel[] = [];

	channelExists(channelName: string): boolean {
		return this.channels.find(ch => ch.name === channelName) !== undefined;
	}

	getEncryptedPhrase(channelName: string): string | undefined {
		const channel = this.channels.find(ch => ch.name === channelName);
		if (channel === undefined) {
			return;
		}
		return channel.encryptedPhrase;
	}

	add(channelName: string, encryptedPhrase: string) {
		this.channels.push({
			name: channelName,
			encryptedPhrase,
			users: []
		});
	}
}

export default new ChannelsModel();
