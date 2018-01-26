import { LOCATION_CHANGE } from 'react-router-redux';
import queryString from 'query-string';
import { matchPath } from 'react-router';

const matchOptions = { path: '/:resourceName?/:id?', exact: false };

export default (state = {}, action) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const match = matchPath(action.payload.pathname, matchOptions);
      return {
        ...action.payload,
        query: queryString.parse(action.payload.search),
        params: match ? match.params || {} : {}
      };
    }
    default:
      return state;
  }
};
