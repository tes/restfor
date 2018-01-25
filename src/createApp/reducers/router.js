import { LOCATION_CHANGE } from 'react-router-redux';
import queryString from 'query-string'


export default (state = {}, action) => {
	switch (action.type) {
		case LOCATION_CHANGE: {
			return {
				...action.payload,
				query: queryString.parse(action.payload.search)
			};
		}
		default:
			return state;
	}
};
