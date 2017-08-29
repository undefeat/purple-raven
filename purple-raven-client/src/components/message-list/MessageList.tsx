import * as React from 'react';

import './MessageList.css';
import { MessageListProps } from './MessageListProps';
import { MessageListState } from './MessageListState';
import MessageItem from '../message-item/MessageItem';
import { messageEditorEventContainer as messageEditorEC } from '../../globals';

class MessageList extends React.Component<MessageListProps, MessageListState> {

	list: HTMLElement;
	audio: HTMLAudioElement;

	state: MessageListState = {
		autoScroll: true
	};

	renderMessageItems = () => {
		const { messages, myName } = this.props;
		return messages.map(message => (
			<MessageItem
				key={message.id}
				isMine={message.author === myName}
				author={message.author}
				content={message.content}
				createdDate={new Date(message.timestamp)}
			/>
		));
	}

	scrollToBottom = () => {
		this.list.scrollTop = this.list.scrollHeight;
	}

	handleScroll = () => {
		const scrolledToBottom = this.list.scrollTop === this.list.scrollHeight - this.list.offsetHeight;
		if (scrolledToBottom) {
			this.setState({
				autoScroll: true
			});
		} else {
			this.setState({
				autoScroll: false
			});
		}
	}

	componentDidMount() {
		this.list.addEventListener('scroll', this.handleScroll);
		messageEditorEC.addEventListener('editorHeightChange', this.scrollToBottom);
	}

	componentWillUnmount() {
		this.list.removeEventListener('scroll', this.handleScroll);
		messageEditorEC.removeEventListener('editorHeightChange', this.scrollToBottom);
	}

	componentDidUpdate(prevProps: MessageListProps) {
		const newMessagesAreAdded = this.props.messages.length > prevProps.messages.length;
		if (newMessagesAreAdded) {
			const lastMessage = this.props.messages[this.props.messages.length - 1];
			if (lastMessage.author !== this.props.myName) {
				this.audio.play();
			}
			if (this.state.autoScroll) {
				this.scrollToBottom();
			}
		}
	}

	render() {
		return (
			<section className="message-list-comp" ref={(el: HTMLElement) => { this.list = el; }}>
				<audio ref={(el: HTMLAudioElement) => { this.audio = el; }} src="/message-tone.mp3" controls={false} autoPlay={false} />
				{this.renderMessageItems()}
			</section>
		);
	}
}

export default MessageList;
