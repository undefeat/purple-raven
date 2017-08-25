import { TITLE_SET } from './constants';
import { TitleAction } from './actions';
import { defaultState } from '../defaultState';

export function titleReducer(state: string = defaultState.title, action: TitleAction): string {
	switch (action.type) {
		case TITLE_SET:
			return action.title;
		
		default:
			return state;
	}
}