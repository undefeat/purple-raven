import { connect, Dispatch } from 'react-redux';

import { StoreState } from '../types/StoreState';
import { SETTINGS } from '../constants';
import ChatApp from '../components/chat-app/ChatApp';
import { titleSet } from '../store/title/actions';
import { connectionClearStatus, connectionValidateAllFields } from '../store/connection/actions';
import { showMessageList } from '../store/thunks';

function mapStateToProps(state: StoreState) {
	return {
		title: state.title,
		showBackBtn: state.title === SETTINGS && state.connection.active,
		showSettingsBtn: state.title !== SETTINGS
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
	return {
		goBack() {
			dispatch(showMessageList());
		},

		openSettings() {
			dispatch(connectionValidateAllFields());
			dispatch(connectionClearStatus());
			dispatch(titleSet(SETTINGS));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatApp);