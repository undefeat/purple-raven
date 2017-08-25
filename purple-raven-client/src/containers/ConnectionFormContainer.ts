import { connect, Dispatch } from 'react-redux';

import { StoreState } from '../types/StoreState';
import ConnectionForm from '../components/connection-form/ConnectionForm';
import { establishConnection } from '../store/thunks';
import { connectionValidateField } from '../store/connection/actions';
import { CHANNEL_FIELD, NAME_FIELD, KEY_FIELD } from '../constants';

function mapStateToProps(state: StoreState) {
	const { status, alert, validity } = state.connection;
	return {
		initialChannelName: state.connection.channelName,
		initialYourName: state.connection.userName,
		status, alert, validity
	};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
	return {
		connect(channel: string, name: string, key: string) {
			dispatch(establishConnection(channel, name, key));
		},

		validateChannelName() {
			dispatch(connectionValidateField(CHANNEL_FIELD));
		},

		validateYourName() {
			dispatch(connectionValidateField(NAME_FIELD));
		},

		validateKey() {
			dispatch(connectionValidateField(KEY_FIELD));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionForm);