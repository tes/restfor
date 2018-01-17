import { RESOLVE_FETCHING_ENTITIES } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_FETCHING_ENTITIES:
      return action.entities.reduce((entities, name) => ({ ...entities, [name]: null }), {});
    default:
      return state;
  }
};
