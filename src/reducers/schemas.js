import { RESOLVE_FETCHING_SCHEMAS, REJECT_FETCHING_SCHEMAS } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_FETCHING_SCHEMAS:
      return action.schemas;
    case REJECT_FETCHING_SCHEMAS:
      return {};
    default:
      return state;
  }
};
