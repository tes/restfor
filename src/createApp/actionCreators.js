import {
  START_FETCHING_SCHEMAS,
  RESOLVE_FETCHING_SCHEMAS,
  REJECT_FETCHING_SCHEMAS,
  START_INVOKING,
  RESOLVE_INVOKING,
  REJECT_INVOKING
} from './actionTypes';

export const openDetails = id => (dispatch, getState, { history }) => {
  const { pathname } = history.location;
  history.push(`${pathname}/${id}`);
};
export const closeDetails = () => (dispatch, getState, { history }) => {
  history.goBack();
};

export const startFetchingSchemas = () => ({ type: START_FETCHING_SCHEMAS });
export const resolveFetchingSchemas = schemas => ({ type: RESOLVE_FETCHING_SCHEMAS, schemas });
export const rejectFetchingSchemas = error => ({ type: REJECT_FETCHING_SCHEMAS, error });

export const fetchSchemas = () => async (dispatch, getState, { api, history }) => {
  try {
    dispatch(startFetchingSchemas());
    const schemas = await api.get('/schemas');
    dispatch(resolveFetchingSchemas(schemas));
    if (schemas.length > 0) history.push('/' + schemas[0].toLowerCase());
  } catch (error) {
    dispatch(rejectFetchingSchemas(error.message));
  }
};

export const startInvoking = () => ({ type: START_INVOKING });
export const resolveInvoking = (result, request, reducer) => ({ type: RESOLVE_INVOKING, result, request, reducer });
export const rejectInvoking = (error, request, reducer) => ({ type: REJECT_INVOKING, error, request, reducer });

export const invoke = (method, resourceName, path, ...args) => async (dispatch, getState, { api }) => {
  const options = args.find(arg => typeof arg === 'object') || { params: {}, query: {} };
  const reducer = args.find(arg => typeof arg === 'function');
  const { params = {}, query = {}, body } = options;
  const request = { method: method.toUpperCase(), resourceName, path, params, query, body };
  try {
    dispatch(startInvoking());
    const result = await api[method.toLowerCase()](`/resources/${resourceName.toLowerCase()}${path}`, {
      params,
      query,
      body
    });
    dispatch(resolveInvoking(result, request, reducer));
  } catch (error) {
    dispatch(rejectInvoking(error.message, request, reducer));
  }
};