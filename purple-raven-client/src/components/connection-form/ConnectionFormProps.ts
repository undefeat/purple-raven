import { Validity } from '../../types/Validity';

export interface ConnectionFormProps {
	initialChannelName: string;
	initialYourName: string;
	connect: (channel: string, name: string, key: string) => void;
	status: string;
	alert: boolean;
	validity: Validity;
	validateChannelName: () => void;
	validateYourName: () => void;
	validateKey: () => void;
}