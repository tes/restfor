import { REJECT_FETCHING_SCHEMAS, REJECT_INVOKING, DISMISS_ERROR, REJECT_ERROR } from '../actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case REJECT_ERROR:
      return action.error;
    case DISMISS_ERROR:
      return null;
    default:
      return state;
  }
};
