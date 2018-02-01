import 'babel-polyfill';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import ViewProvider from './components/ViewProvider';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import App from './components/App';
import createApi from './createApi';
import { history } from './createHashHistory';
import createStore from './createStore';
import createViews from './createViews';
import createApolloClient from './createApolloClient';

export default (config, viewFactory = () => {}) => {
  const theme = createMuiTheme({
    direction: 'ltr',
    palette: {
      primary: blue,
      type: 'light'
    }
  });

  const api = createApi(config.apiUrl);
  const graphql = createApolloClient(config.apiUrl);
  const store = createStore({ api, graphql, history });
  const views = createViews(viewFactory);
  return (
    <MuiThemeProvider theme={theme}>
      <ViewProvider views={views}>
        <StoreProvider store={store}>
          <ConnectedRouter history={history}>
            <Route path="/:resourceName?/:id?" component={App} />
          </ConnectedRouter>
        </StoreProvider>
      </ViewProvider>
    </MuiThemeProvider>
  );
};
