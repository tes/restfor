import { stringify } from 'querystring';

const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://localhost:3001';

const call = method => (path, { query = {}, headers = {}, body } = {}) =>
  fetch(`${API_URL}${path}?${stringify(query)}`, {
    method: method.toUpperCase(),
    body: body ? JSON.stringify(body) : undefined,
    headers
  }).then(res => res.json());

export default {
  get: call('GET'),
  post: call('POST'),
  put: call('PUT'),
  delete: call('DELETE')
};
