import { stringify } from 'querystring';

const injectParams = (path, params) =>
  Object.keys(params).reduce((path, key) => path.replace(':' + key, params[key]), path);

const call = (baseUrl, method) => (path, { params = {}, query = {}, headers = {}, body } = {}) =>
  fetch(`${baseUrl}${injectParams(path, params)}?${stringify(query)}`, {
    method: method.toUpperCase(),
    body: body ? JSON.stringify(body) : undefined,
    headers: { ...headers, 'Content-Type': 'application/json' }
  })
    .then(async res => {
      const json = await res.json();
      if (!res.ok) throw new Error('Something went wrong');
      return json;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });

export default baseUrl => ({
  get: call(baseUrl, 'GET'),
  post: call(baseUrl, 'POST'),
  put: call(baseUrl, 'PUT'),
  delete: call(baseUrl, 'DELETE')
});
