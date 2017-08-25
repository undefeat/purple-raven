import { TITLE_SET } from './constants';

export interface TitleSetAction {
	type: TITLE_SET;
	title: string;
}

export type TitleAction = TitleSetAction;

export function titleSet(title: string): TitleSetAction {
	return {
		type: TITLE_SET,
		title
	};
}