import * as React from 'react';

import './ChatApp.css';
import { ChatAppProps } from './ChatAppProps';
import { SETTINGS } from '../../constants';
import AppHeader from '../app-header/AppHeader';
import ConnectionFormContainer from '../../containers/ConnectionFormContainer';
import MessageListContainer from '../../containers/MessageListContainer';
import MessageEditorContainer from '../../containers/MessageEditorContainer';

function ChatApp(props: ChatAppProps) {
	const { title } = props;

	return (
		<div className="chat-app-comp">
			<AppHeader {...props} />

			{title === SETTINGS && <ConnectionFormContainer />}

			{title !== SETTINGS && <MessageListContainer />}
			{title !== SETTINGS && <MessageEditorContainer />}
		</div>
	);
}

export default ChatApp;
