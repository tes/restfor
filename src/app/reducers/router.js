import { LOCATION_CHANGE } from 'react-router-redux';
import { matchRoutes } from 'react-router-config';
import queryString from 'query-string';
import { matchPath,  } from 'react-router';
const matchOptions = { path: '/:resourceName?/:id?', exact: false };
const routeOptions = [ 
  { path: '/:resourceName', exact: true },
  { path: '/:resourceName/item/:id', exact: true },
  { path: '/:resourceName/segment/:segment/', exact: true },
  { path: '/:resourceName/segment/:segment/item/:id', exact: true },
  { path: '/:resourceName/item/:id/edit', exact: true },
  { path: '/:resourceName/segment/:segment/item/:id/edit', exact: true },
]

export default (state = {}, action) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const [ firstMatch ] = matchRoutes(routeOptions, action.payload.pathname)
      if (!firstMatch) return state;
      const { match, route } = firstMatch;
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
