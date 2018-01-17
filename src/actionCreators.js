import {
  START_FETCHING_ENTITIES,
  RESOLVE_FETCHING_ENTITIES,
  REJECT_FETCHING_ENTITIES,
  START_INVOKING,
  RESOLVE_INVOKING,
  REJECT_INVOKING
} from './actionTypes';

export const startFetchingEntities = () => ({ type: START_FETCHING_ENTITIES });
export const resolveFetchingEntities = entities => ({ type: RESOLVE_FETCHING_ENTITIES, entities });
export const rejectFetchingEntities = error => ({ type: REJECT_FETCHING_ENTITIES, error });
export const fetchEntities = () => async (dispatch, getState, { api }) => {
  try {
    dispatch(startFetchingEntities());
    const entities = await api.get('/entities');
    dispatch(resolveFetchingEntities(entities));
  } catch (error) {
    dispatch(rejectFetchingEntities(error.message));
  }
};

export const startInvoking = (method, path) => ({ type: START_INVOKING, method, path });
export const resolveInvoking = (method, path, result) => ({ type: RESOLVE_INVOKING, method, path, result });
export const rejectInvoking = (method, path, error) => ({ type: REJECT_INVOKING, method, path, error });
export const invoke = (method, path, { query = {}, body } = {}) => async (dispatch, getState, { api }) => {
  try {
    dispatch(startInvoking(method.toUpperCase(), path));
    const result = await api[method.toLowerCase()](path);
    dispatch(resolveInvoking(method.toUpperCase(), path, result));
  } catch (error) {
    dispatch(rejectInvoking(method.toUpperCase(), path, error.message));
  }
};
