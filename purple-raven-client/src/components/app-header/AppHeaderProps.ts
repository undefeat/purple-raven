export interface AppHeaderProps {
	title: string;
	showBackBtn: boolean;
	showSettingsBtn: boolean;
	clear: () => void;
	goBack: () => void;
	openSettings: () => void;
}
