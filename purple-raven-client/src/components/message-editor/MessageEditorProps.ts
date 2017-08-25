export interface MessageEditorProps {
	content: string;
	updateContent: (content: string) => void;
	send: () => void;
}