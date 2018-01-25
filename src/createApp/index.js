import 'babel-polyfill';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import ViewProvider from './components/ViewProvider';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import App from './components/App';
import createApi from './createApi';
import createHashHistory from 'history/createHashHistory';
import createStore from './createStore';
import createViews from './createViews';

const theme = createMuiTheme({
  palette: {
    primary: blue
  }
});

export default (config, viewFactory = () => {}) => {
  const theme = createMuiTheme();
  const hashHistory = createHashHistory();
  const api = createApi(config.apiUrl);
  const store = createStore({ api, hashHistory });
  const views = createViews(viewFactory);
  return (
    <MuiThemeProvider >
      <ViewProvider views={views}>
        <StoreProvider store={store}>
          <Router history={hashHistory}>
            <Route path="/:resourceName?/:id?" component={App} />
          </Router>
        </StoreProvider>
      </ViewProvider>
    </MuiThemeProvider>
  );
};
