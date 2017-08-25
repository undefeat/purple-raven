export interface MessageItemProps {
	isMine: boolean;
	author: string;
	content: string;
	createdDate: Date | null;
}