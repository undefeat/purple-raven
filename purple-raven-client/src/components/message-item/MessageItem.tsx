import * as React from 'react';

import './MessageItem.css';
import { MessageItemProps } from './MessageItemProps';
import { MessageItemState } from './MessageItemState';

class MessageItem extends React.Component<MessageItemProps, MessageItemState> {

	state: MessageItemState = {
		now: new Date()
	};

	intervalId: number;

	renderParagraphs(content: string) {
		return content.split(/\n/).map((line, index) => {
			if (line.trim().length === 0) {
				return null;
			}
			return <p key={index}>{line}</p>;
		});
	}

	isPlural(n: number) {
		const str = String(n);
		if (str.endsWith('1') && !str.endsWith('11')) {
			return false;
		}
		return true;
	}

	getTimePassed(dateFrom: Date, dateTo: Date) {
		const fromTimestamp = dateFrom.valueOf();
		const toTimestamp = dateTo.valueOf();

		if (fromTimestamp > toTimestamp) {
			return 'just now';
		}

		const secondsPassed = (toTimestamp - fromTimestamp) / 1000;
		const minutesPassed = Math.floor(secondsPassed / 60);
		const hoursPassed = Math.floor(secondsPassed / (60 * 60));
		const daysPassed = Math.floor(secondsPassed / (60 * 60 * 24));
		const monthsPassed = Math.floor(secondsPassed / (60 * 60 * 24 * 30.5));
		const yearsPassed = Math.floor(secondsPassed / (60 * 60 * 24 * 365));

		if (yearsPassed > 0) {
			if (this.isPlural(yearsPassed)) {
				return `${yearsPassed} years`;
			}
			return `${yearsPassed} year`;
		}

		if (monthsPassed > 0) {
			if (this.isPlural(monthsPassed)) {
				return `${monthsPassed} months`;
			}
			return `${monthsPassed} month`;
		}

		if (daysPassed > 0) {
			if (this.isPlural(daysPassed)) {
				return `${daysPassed} days`;
			}
			return `${daysPassed} day`;
		}

		if (hoursPassed > 0) {
			if (this.isPlural(hoursPassed)) {
				return `${hoursPassed} hours`;
			}
			return `${hoursPassed} hour`;
		}

		if (minutesPassed > 0) {
			if (this.isPlural(minutesPassed)) {
				return `${minutesPassed} mins`;
			}
			return `${minutesPassed} min`;
		}

		return 'just now';
	}

	componentDidMount() {
		this.intervalId = window.setInterval(
			() => {
				this.setState({ now: new Date() });
			},
			1000
		);
	}

	componentWillUnmount() {
		window.clearInterval(this.intervalId);
	}

	render() {
		const { isMine, author, content, createdDate } = this.props;

		return (
			<article className={'message-item-comp' + (isMine ? ' my-message' : '')}>
				<header className="message-header">
				{!isMine &&
					<span className="author">
						{author[0]}
						<div className="title">{author}</div>
					</span>
				}
				</header>
				<div className="message-content">
					{this.renderParagraphs(content)}
				</div>
				{createdDate !== null &&
				<footer className="message-footer">
					<time dateTime={createdDate.toISOString()}>
						{this.getTimePassed(createdDate, this.state.now)}
					</time>
				</footer>
				}
			</article>
		);
	}
}

export default MessageItem;
