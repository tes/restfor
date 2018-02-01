import {
  RESOLVE_FETCHING_SCHEMAS,
  RESOLVE_INVOKING,
  REJECT_INVOKING,
  RESOLVE_FETCHING_ITEMS,
  RESOLVE_FETCHING_ITEM,
  RESOLVE_UPDATING_ITEM
} from '../actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case RESOLVE_FETCHING_SCHEMAS:
      return Object.keys(action.schemas).reduce(
        (resources, name) => ({
          ...resources,
          [name]: state[name] || { items: [], count: 0 }
        }),
        {}
      );
    case RESOLVE_FETCHING_ITEMS:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]: action.resourceName === name
            ? { ...state[name], items: action.items, count: action.count }
            : state[name]
        }),
        {}
      );
    case RESOLVE_UPDATING_ITEM:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]: action.resourceName === name
            ? { ...state[name], items: state[name].items.map(item => (item.id === action.id ? action.item : item)) }
            : state[name]
        }),
        {}
      );
    case RESOLVE_FETCHING_ITEM:
      return Object.keys(state).reduce(
        (nextState, name) => ({
          ...nextState,
          [name]: action.resourceName === name ? { ...state[name], items: [action.item] } : state[name]
        }),
        {}
      );
    default:
      return state;
  }
};
