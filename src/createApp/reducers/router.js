import { LOCATION_CHANGE } from 'react-router-redux';

export default (state = {}, action) => {
	switch (action.type) {
		case LOCATION_CHANGE: {
			return {
				...action.payload,
				query: action.payload.search.substr(1)
			};
		}
		default:
			return state;
	}
};
