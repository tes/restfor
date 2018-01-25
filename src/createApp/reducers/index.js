import { combineReducers } from 'redux';
import schemas from './schemas';
import resources from './resources';
import isFetching from './isFetching';
import error from './error';
import settings from './settings';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
	schemas,
	resources,
	isFetching,
	error,
	settings,
	router: routerReducer
});
