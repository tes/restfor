import "babel-polyfill";
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider as StoreProvider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux'

import ViewProvider from './components/ViewProvider';
import App from './components/App';
import createApi from './createApi';
import {history} from './history' 
import createStore from './createStore';
import createViews from './createViews';

export default (config, viewFactory = () => {}) => {
  const api = createApi(config.apiUrl);
  const store = createStore({ api, history });
  const views = createViews(viewFactory);
  return (
    <MuiThemeProvider>
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
