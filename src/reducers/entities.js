import { RESOLVE_FETCHING_ENTITIES } from '../actionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case RESOLVE_FETCHING_ENTITIES:
      return action.entities;
    default:
      return state;
  }
};
