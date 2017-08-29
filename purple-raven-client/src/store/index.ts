import * as connectionActions from './connection/actions';
import * as messagesActions from './messages/actions';
import * as titleActions from './title/actions';

export type Action = connectionActions.ConnectionAction | messagesActions.MessagesAction | titleActions.TitleSetAction | any;
