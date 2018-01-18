import { OPEN_DETAILS, CLOSE_DETAILS } from '../actionTypes';

const initialState = { resourceName: null, id: null };

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_DETAILS:
      return { resourceName: action.resourceName, id: action.id };
    case CLOSE_DETAILS:
      return initialState;
    default:
      return state;
  }
};
