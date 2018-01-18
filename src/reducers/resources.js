import { RESOLVE_FETCHING_SCHEMAS, RESOLVE_INVOKING, REJECT_INVOKING } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_FETCHING_SCHEMAS:
      return Object.keys(action.schemas).reduce(
        (resources, name) => ({
          ...resources,
          [name]: state[name] || { items: [], count: 0, page: 0 }
        }),
        {}
      );
    case RESOLVE_INVOKING:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]:
            action.request.resourceName === name && action.reducer
              ? action.reducer(state[name], null, action.result)
              : state[name]
        }),
        {}
      );
    case REJECT_INVOKING:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]:
            action.request.resourceName === name && action.reducer
              ? action.reducer(state[name], action.error)
              : state[name]
        }),
        {}
      );
    default:
      return state;
  }
};
