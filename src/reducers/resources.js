import { RESOLVE_INVOKING, REJECT_INVOKING } from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_INVOKING:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]: action.reducer ? action.reducer(state[name], null, action.result) : state[name]
        }),
        {}
      );
    case REJECT_INVOKING:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]: action.reducer ? action.reducer(state[name], action.error) : state[name]
        }),
        {}
      );
    default:
      return state;
  }
};
