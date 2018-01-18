import { REJECT_FETCHING_SCHEMAS, REJECT_INVOKING } from '../actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case REJECT_FETCHING_SCHEMAS:
      return action.error;
    case REJECT_INVOKING:
      return action.error;
    default:
      return state;
  }
};
