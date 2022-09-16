
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger'
import { authReducer } from './auth'
import thunk from 'redux-thunk'

import { settingsReducer } from './settings'

import { productRegistrationReducer } from './productRegistration'
import { scanProductReducer } from './scanProduct'

//@redux-helper/rootReducer
const rootReducer = combineReducers({
	auth: authReducer,
	settings: settingsReducer,
	productRegistration: productRegistrationReducer,
	scanProduct: scanProductReducer
});

export type StateType = ReturnType<typeof rootReducer>;
export function configureStore() {
	const middleware = [];
	middleware.push(thunk);

	if (process.env.NODE_ENV !== 'production') {
		middleware.push(createLogger());
	}

	const store = createStore(rootReducer, compose(applyMiddleware(...middleware)));
	return store;
}

