export interface AppHeaderProps {
	title: string;
	showBackBtn: boolean;
	showSettingsBtn: boolean;
	goBack: () => void;
	openSettings: () => void;
}