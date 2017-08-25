import { connect, Dispatch } from 'react-redux';

import { StoreState } from '../types/StoreState';
import MessageEditor from '../components/message-editor/MessageEditor';
import { messagesSetNew } from '../store/messages/actions';
import { sendMessage } from '../store/thunks';

function mapStateToProps(state: StoreState) {
	return {
		content: state.messages.newMessage
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
	return {
		updateContent(content: string) {
			dispatch(messagesSetNew(content));
		},

		send() {
			dispatch(sendMessage());
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageEditor);