export const resolvePage = rawPage => {
  const page = Number(rawPage);
  return Number.isInteger(page) && page > 0 ? page - 1 : 0;
};

export const getOffsetFromPage = (rawPage, limit) => resolvePage(rawPage) * limit;
