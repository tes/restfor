import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

export default extraArguments =>
  createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(extraArguments))));
