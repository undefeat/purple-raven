import { isLocalhost } from './registerServiceWorker';

export const SETTINGS = 'Connection Settings';

export const AUTO_MESSAGE_AUTHOR = 'Raven';

export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const CHANNEL_FIELD = 'channel';
export const NAME_FIELD = 'name';
export const KEY_FIELD = 'key';

export const RANDOM_STRING_LENGTH = 255;

export let SERVER_URL = isLocalhost && window.location.port !== '8080' ? 'http://localhost:8080' : '';
export const CHANNELS_API_URL = `${SERVER_URL}/api/channels`;
