import { combineReducers } from 'redux';
import entities from './entities';
import isFetching from './isFetching';
import error from './error';

export default combineReducers({
  entities,
  isFetching,
  error
});
