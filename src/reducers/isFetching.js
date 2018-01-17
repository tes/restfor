import {
  START_FETCHING_ENTITIES,
  START_INVOKING,
  RESOLVE_FETCHING_ENTITIES,
  RESOLVE_INVOKING,
  REJECT_FETCHING_ENTITIES,
  REJECT_INVOKING
} from '../actionTypes';

export default (state = false, action) => {
  switch (action.type) {
    case START_FETCHING_ENTITIES:
      return true;
    case START_INVOKING:
      return true;
    case RESOLVE_FETCHING_ENTITIES:
      return false;
    case RESOLVE_INVOKING:
      return false;
    case REJECT_FETCHING_ENTITIES:
      return false;
    case REJECT_INVOKING:
      return false;
    default:
      return state;
  }
};
