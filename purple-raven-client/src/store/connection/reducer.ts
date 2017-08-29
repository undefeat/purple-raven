import {
	CONNECTION_SET_DETAILS,
	CONNECTION_SET_STATUS,
	CONNECTION_CLEAR_STATUS,
	CONNECTION_SET_ACTIVE,
	CONNECTION_VALIDATE_FIELD,
	CONNECTION_INVALIDATE_FIELD,
	CONNECTION_VALIDATE_ALL_FIELDS
} from './constants';
import { ConnectionAction } from './actions';
import { Connection } from '../../types/Connection';
import { defaultState } from '../defaultState';

export function connectionReducer(state: Connection = defaultState.connection, action: ConnectionAction): Connection {
	switch (action.type) {
		case CONNECTION_SET_ACTIVE:
			return { ...state, active: action.active };

		case CONNECTION_SET_DETAILS: {
			const { channelName, userName, encryptionKey } = action;
			return { ...state, channelName, userName, encryptionKey };
		}

		case CONNECTION_SET_STATUS: {
			const { status, alert } = action;
			return { ...state, status, alert };
		}

		case CONNECTION_CLEAR_STATUS: {
			return { ...state, status: '', alert: false };
		}

		case CONNECTION_VALIDATE_FIELD: {
			const { fieldName } = action;
			const validity = { ...state.validity };
			if (validity.hasOwnProperty(fieldName)) {
				validity[fieldName] = true;
			} else {
				throw Error(`A field with a name "${fieldName}" does not exist in the connection form`);
			}
			return { ...state, validity };
		}

		case CONNECTION_INVALIDATE_FIELD: {
			const { fieldName } = action;
			const validity = { ...state.validity };
			if (validity.hasOwnProperty(fieldName)) {
				validity[fieldName] = false;
			} else {
				throw Error(`A field with a name "${fieldName}" does not exist in the connection form`);
			}
			return { ...state, validity };
		}

		case CONNECTION_VALIDATE_ALL_FIELDS: {
			const validity = { ...state.validity };
			for (const fieldName of Object.keys(validity)) {
				validity[fieldName] = true;
			}
			return { ...state, validity };
		}

		default:
			return state;
	}
}
