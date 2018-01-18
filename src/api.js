import { stringify } from 'querystring';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://localhost:3001';

const injectParams = (path, params) =>
  Object.keys(params).reduce((path, key) => path.replace(':' + key, params[key]), path);

const call = method => (path, { params = {}, query = {}, headers = {}, body } = {}) =>
  fetch(`${API_URL}${injectParams(path, params)}?${stringify(query)}`, {
    method: method.toUpperCase(),
    body: body ? JSON.stringify(body) : undefined,
    headers: { ...headers, 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .catch(error => {
      console.error(error);
      throw error;
    });

export default {
  get: call('GET'),
  post: call('POST'),
  put: call('PUT'),
  delete: call('DELETE')
};
