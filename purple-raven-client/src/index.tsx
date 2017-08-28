import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'css-ripple-effect/dist/ripple.css';

import reducer from './store/reducer';
import { StoreState } from './types/StoreState';
import ChatAppContainer from './containers/ChatAppContainer';

if (typeof(Storage) === "undefined") {
	ReactDOM.render(
		<p>
			Your browser does not support Web Storage API. Please update your browser or use another one.
		</p>,
		document.getElementById('chat-root')
	);
} else {
	const store = createStore<StoreState>(
		reducer,
		composeWithDevTools(
			applyMiddleware(thunk),
		)
	);

	ReactDOM.render(
		<Provider store={store}>
			<ChatAppContainer />
		</Provider>,
		document.getElementById('chat-root')
	);

	registerServiceWorker();
}
