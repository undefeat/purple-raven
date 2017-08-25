import * as React from 'react';

import './ConnectionForm.css';
import { ConnectionFormProps } from './ConnectionFormProps';
import { ConnectionFormState } from './ConnectionFormState';

class ConnectionForm extends React.Component<ConnectionFormProps, ConnectionFormState> {

	channelNameInput: HTMLInputElement;
	yourNameInput: HTMLInputElement;
	encryptionKeyInput: HTMLInputElement;

	handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const channelName = this.channelNameInput.value;
		const yourName = this.yourNameInput.value;
		const encryptionKey = this.encryptionKeyInput.value;

		this.props.connect(channelName, yourName, encryptionKey);
	}

	render() {
		const { status, alert, initialChannelName, initialYourName, validity } = this.props;
		const { validateChannelName, validateYourName, validateKey } = this.props;

		return (
			<form className="connection-form-comp" onSubmit={this.handleFormSubmit}>
				<div>
					<label className={'input-field' + (validity.channel ? '' : ' alert')}>
						<span className="input-name">Channel Name:</span>
						<input
							ref={(el: HTMLInputElement) => { this.channelNameInput = el; }}
							type="text"
							required={true}
							placeholder="Enter channel name without @"
							defaultValue={initialChannelName}
							onChange={validateChannelName}
						/>
						<span className="constraints">
							Valid chars: a-zA-Z0-9, no spaces, max-length - 12 chars.
						</span>
						<span className="description">
							If such channel doesn't exist it will be created, otherwise you will be connected to the existing one.
						</span>
					</label>
					<label className={'input-field' + (validity.name ? '' : ' alert')}>
						<span className="input-name">Your Name:</span>
						<input
							ref={(el: HTMLInputElement) => { this.yourNameInput = el; }}
							type="text"
							required={true}
							placeholder="Enter your nickname"
							defaultValue={initialYourName}
							onChange={validateYourName}
						/>
						<span className="constraints">
							Valid chars: a-zA-Z0-9, no spaces, max-length - 9 chars.
						</span>
						<span className="description">
							Will be displayed alongside your messages.
						</span>
					</label>
					<label className={'input-field' + (validity.key ? '' : ' alert')}>
						<span className="input-name">Encryption key:</span>
						<input
							ref={(el: HTMLInputElement) => { this.encryptionKeyInput = el; }}
							type="password"
							required={true}
							placeholder="Enter encryption key"
							defaultValue=""
							onChange={validateKey}
						/>
						<span className="constraints">
							Valid chars: a-zA-Z0-9, no spaces, min-length - 8 chars, max-length - 16 chars.
						</span>
						<span className="description">
							Will be used to encrypt/decrypt messages on the channel.
						</span>
					</label>
				</div>
				{status &&
					<p className={'status' + (alert ? ' alert' : '')}>
						{status}
					</p>
				}
				<button type="submit" className="ripple">Connect</button>
			</form>
		);
	}
}

export default ConnectionForm;