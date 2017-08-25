import {
	CONNECTION_SET_DETAILS,
	CONNECTION_SET_STATUS,
	CONNECTION_CLEAR_STATUS,
	CONNECTION_SET_ACTIVE,
	CONNECTION_VALIDATE_FIELD,
	CONNECTION_INVALIDATE_FIELD,
	CONNECTION_VALIDATE_ALL_FIELDS
} from './constants';

export interface ConnectionSetDetailsAction {
	type: CONNECTION_SET_DETAILS;
	channelName: string;
	userName: string;
	encryptionKey: string;
}

export interface ConnectionSetStatusAction {
	type: CONNECTION_SET_STATUS;
	status: string;
	alert: boolean;
}

export interface ConnectionClearStatusAction {
	type: CONNECTION_CLEAR_STATUS;
}

export interface ConnectionSetActiveAction {
	type: CONNECTION_SET_ACTIVE;
	active: boolean;
}

export interface ConnectionValidateFieldAction {
	type: CONNECTION_VALIDATE_FIELD;
	fieldName: string;
}

export interface ConnectionInvalidateFieldAction {
	type: CONNECTION_INVALIDATE_FIELD;
	fieldName: string;
}

export interface ConnectionValidateAllFieldsAction {
	type: CONNECTION_VALIDATE_ALL_FIELDS;
}

export type ConnectionAction = ConnectionSetDetailsAction | ConnectionSetStatusAction |
ConnectionClearStatusAction | ConnectionSetActiveAction | ConnectionValidateFieldAction |
ConnectionInvalidateFieldAction | ConnectionValidateAllFieldsAction;

export function connectionSetDetails(
	channelName: string, userName: string, encryptionKey: string): ConnectionSetDetailsAction {
	return {
		type: CONNECTION_SET_DETAILS,
		channelName, userName, encryptionKey
	};
}

export function connectionSetStatus(status: string, alert: boolean = false): ConnectionSetStatusAction {
	return {
		type: CONNECTION_SET_STATUS,
		status, alert
	};
}

export function connectionClearStatus(): ConnectionClearStatusAction {
	return {
		type: CONNECTION_CLEAR_STATUS
	};
}

export function connectionSetActive(active: boolean = true): ConnectionSetActiveAction {
	return {
		type: CONNECTION_SET_ACTIVE,
		active
	};
}

export function connectionValidateField(fieldName: string): ConnectionValidateFieldAction {
	return {
		type: CONNECTION_VALIDATE_FIELD,
		fieldName
	};
}

export function connectionInvalidateField(fieldName: string): ConnectionInvalidateFieldAction {
	return {
		type: CONNECTION_INVALIDATE_FIELD,
		fieldName
	};
}

export function connectionValidateAllFields(): ConnectionValidateAllFieldsAction {
	return {
		type: CONNECTION_VALIDATE_ALL_FIELDS
	};
}