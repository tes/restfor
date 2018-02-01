import { TOGGLE_FETCHING } from '../actionTypes';

export default (state = false, action) => {
  switch (action.type) {
    case TOGGLE_FETCHING:
      return action.value;
    default:
      return state;
  }
};
