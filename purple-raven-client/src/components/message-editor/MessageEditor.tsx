import * as React from 'react';

import './MessageEditor.css';
import { MessageEditorProps } from './MessageEditorProps';
import { MessageEditorState } from './MessageEditorState';
import { isMobile } from '../../helpers';
import { messageEditorEventContainer as messageEditorEC } from '../../globals';

class MessageEditor extends React.Component<MessageEditorProps, MessageEditorState> {

	textarea: HTMLTextAreaElement;

	state: MessageEditorState = {
		height: 0
	};

	handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!isMobile() && event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			this.handleSendMessage();
		}
	}

	handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = (event.target as HTMLTextAreaElement).value;
		this.props.updateContent(value);
	}

	handleSendMessage = () => {
		if (this.props.content.trim().length > 0) {
			this.props.send();
		}
	}

	updateTextAreaHeight = () => {
		if (this.textarea.scrollHeight !== this.state.height) {
			this.setState({ height: this.textarea.scrollHeight });
		}
	}

	componentDidMount() {
		this.updateTextAreaHeight();
		window.addEventListener('resize', this.updateTextAreaHeight);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateTextAreaHeight);
	}

	componentDidUpdate(prevProps: MessageEditorProps, prevState: MessageEditorState) {
		this.updateTextAreaHeight();
		if (prevState.height !== this.state.height) {
			messageEditorEC.emit('editorHeightChange');
		}
	}

	render() {
		const { content } = this.props;
		const { height } = this.state;

		return (
			<div className="message-editor-comp">
				<textarea
					placeholder="Write a message"
					ref={(el: HTMLTextAreaElement) => { this.textarea = el; }}
					value={content}
					onKeyDown={this.handleKeyDown}
					onChange={this.handleTextAreaChange}
					style={{ minHeight: height }}
					autoFocus={true}
				/>
				<button
					type="button"
					className="button-send ripple"
					title="Send"
					onClick={this.handleSendMessage}
					disabled={content.trim().length === 0}
				>
					<svg viewBox="0 0 24 24">
						<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
						<path d="M0 0h24v24H0z" fill="none" />
					</svg>
				</button>
			</div>
		);
	}
}

export default MessageEditor;
