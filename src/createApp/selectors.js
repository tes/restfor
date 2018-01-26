import { resolvePage } from './helpers/page';

export const getResourceName = ({ router: { params: { resourceName } } }) => resourceName;

export const getId = ({ router: { params: { id } } }) => (id ? Number(id) : null);

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
  return resources[resourceName] && resources[resourceName].items;
};

export const getSchemaList = ({ schemas }) => Object.keys(schemas);
