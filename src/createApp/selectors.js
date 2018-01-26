import { resolvePage } from './helpers/page';

const a = [];
const o = {};

export const getPathname = ({ router: { pathname } }) => pathname;

export const getResourceName = ({ router: { params: { resourceName } } }) => resourceName;

export const getId = ({ router: { params: { id } } }) => (id && id !== 'new' ? Number(id) : id || null);

export const getPage = ({ router: { query: { page } } }) => resolvePage(page);

export const getMaxPage = resourceName => ({ settings: { limit }, resources }) => {
  const resource = resources[resourceName];
  if (!resource) return null;
  return Math.ceil(resource.count / limit);
};

export const getLimit = ({ settings: { limit } }) => limit;

export const getItems = state => {
  const resourceName = getResourceName(state);
  const { resources } = state;
  return (resources[resourceName] && resources[resourceName].items) || a;
};

export const getRecord = state => {
  const items = getItems(state);
  const id = getId(state);
  if (!Number.isFinite(id)) return null;
  return items.find(record => record.id === id) || null;
};

export const getSchema = state => {
  const resourceName = getResourceName(state);
  return resourceName && state.schemas ? state.schemas[resourceName] || o : o;
};

export const getSchemaList = ({ schemas }) => (schemas ? Object.keys(schemas) : a);
