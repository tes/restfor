import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { hashHistory } from 'react-router';
import rootReducer from './reducers';
import api from './api';

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk.withExtraArgument({ api, hashHistory })))
);
