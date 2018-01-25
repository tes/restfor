import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import history from './history';
import { routerMiddleware } from 'react-router-redux';

const middleware = routerMiddleware(history);

export default (extraArguments) =>
	createStore(rootReducer, composeWithDevTools(applyMiddleware(middleware, thunk.withExtraArgument(extraArguments))));
