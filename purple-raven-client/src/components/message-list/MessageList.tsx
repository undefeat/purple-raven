import * as React from 'react';

import './MessageList.css';
import { MessageListProps } from './MessageListProps';
import { MessageListState } from './MessageListState';
import MessageItem from '../message-item/MessageItem';
import { messageEditorEventContainer as messageEditorEC } from '../../globals';

class MessageList extends React.Component<MessageListProps, MessageListState> {

	list: HTMLElement;
	scrollToBottomBtn: HTMLButtonElement;
	audio: HTMLAudioElement;

	state: MessageListState = {
		autoScroll: true
	};

	scrolledToBottom = () => {
		return this.list ? this.list.scrollTop === this.list.scrollHeight - this.list.offsetHeight : true;
	}

	scrollToBottom = () => {
		this.list.scrollTop = this.list.scrollHeight;
	}

	positionScrollToBottomBtn = () => {
		this.scrollToBottomBtn.style.top = this.list.offsetHeight + 'px';
		this.scrollToBottomBtn.style.left = ((window.innerWidth - this.scrollToBottomBtn.offsetWidth) / 2)  + 'px';
	}

	handleScroll = () => {
		this.setState({
			autoScroll: this.scrolledToBottom()
		});
	}

	handleScrollToBottomClick = () => {
		this.scrollToBottom();
		this.setState({
			autoScroll: true
		});
	}

	handleBlur = () => {
		this.setState({
			autoScroll: false
		});
	}

	handleFocus = () => {
		this.setState({
			autoScroll: this.scrolledToBottom()
		});
	}

	handleNewMessage = () => {
		if (this.state.autoScroll) {
			this.scrollToBottom();
		}
	}

	componentDidMount() {
		this.audio.volume = 0.25;
		this.list.addEventListener('scroll', this.handleScroll);
		messageEditorEC.addEventListener('editorHeightChange', this.scrollToBottom);
		messageEditorEC.addEventListener('editorHeightChange', this.positionScrollToBottomBtn);
		window.addEventListener('resize', this.positionScrollToBottomBtn);
		window.addEventListener('blur', this.handleBlur);
		window.addEventListener('focus', this.handleFocus);
	}

	componentWillUnmount() {
		this.list.removeEventListener('scroll', this.handleScroll);
		messageEditorEC.removeEventListener('editorHeightChange', this.scrollToBottom);
		messageEditorEC.removeEventListener('editorHeightChange', this.positionScrollToBottomBtn);
		window.removeEventListener('resize', this.positionScrollToBottomBtn);
		window.removeEventListener('blur', this.handleBlur);
		window.removeEventListener('focus', this.handleFocus);
	}

	componentDidUpdate(prevProps: MessageListProps) {
		const newMessagesAreAdded = this.props.messages.length > prevProps.messages.length;
		if (newMessagesAreAdded) {
			const lastMessage = this.props.messages[this.props.messages.length - 1];
			if (lastMessage.author !== this.props.myName) {
				this.audio.play();
			}
			this.handleNewMessage();
		}
	}

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

	render() {
		return (
			<section className="message-list-comp" ref={(el: HTMLElement) => { this.list = el; }}>
				<audio
					ref={(el: HTMLAudioElement) => { this.audio = el; }}
					src="/message-tone.mp3"
					controls={false}
					autoPlay={false}
				/>
				{this.renderMessageItems()}
				<button
					ref={(el: HTMLButtonElement) => { this.scrollToBottomBtn = el; }}
					type="button"
					className="scroll-to-bottom ripple"
					onClick={this.handleScrollToBottomClick}
					disabled={this.scrolledToBottom()}
				>
					Jump to last <span className="arrow-down">↓</span>
				</button>
			</section>
		);
	}
}

export default MessageList;
