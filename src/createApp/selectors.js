export const getMaxPage = resourceName => ({ settings: { limit }, resources }) => {
  const resource = resources[resourceName];
  if (!resource) return null;
  return Math.ceil(resource.count / limit);
};
