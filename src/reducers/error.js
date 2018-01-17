import { REJECT_FETCHING_ENTITIES, REJECT_INVOKING } from '../actionTypes';

export default (state = null, action) => {
  switch (action.type) {
    case REJECT_FETCHING_ENTITIES:
      return action.error;
    case REJECT_INVOKING:
      return action.error;
    default:
      return state;
  }
};
