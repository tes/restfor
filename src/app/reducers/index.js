import { combineReducers } from 'redux';
import schemas from './schemas';
import resources from './resources';
import isFetching from './isFetching';
import error from './error';
import settings from './settings';
import router from './router'

export default combineReducers({
	schemas,
	resources,
	isFetching,
	error,
	settings,
	router
});
