import { connect, Dispatch } from 'react-redux';

import { StoreState } from '../types/StoreState';
import MessageList from '../components/message-list/MessageList';
import { Action } from '../store';

function mapStateToProps(state: StoreState) {
	return {
		messages: state.messages.items,
		myName: state.connection.userName
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {

	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
