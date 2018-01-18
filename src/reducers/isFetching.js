import {
  START_FETCHING_SCHEMAS,
  START_INVOKING,
  RESOLVE_FETCHING_SCHEMAS,
  RESOLVE_INVOKING,
  REJECT_FETCHING_SCHEMAS,
  REJECT_INVOKING
} from '../actionTypes';

export default (state = false, action) => {
  switch (action.type) {
    case START_FETCHING_SCHEMAS:
      return true;
    case START_INVOKING:
      return true;
    case RESOLVE_FETCHING_SCHEMAS:
      return false;
    case RESOLVE_INVOKING:
      return false;
    case REJECT_FETCHING_SCHEMAS:
      return false;
    case REJECT_INVOKING:
      return false;
    default:
      return state;
  }
};
