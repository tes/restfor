import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

export default apiUrl => {
  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link: new HttpLink({ uri: `${apiUrl}/graphql` }),
    cache
  });

  const query = client.query;

  client.query = (...args) => {
    cache.reset();
    return query(...args);
  };

  return client;
};
