import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import ViewProvider, { getViews } from './components/ViewProvider';
import App from './components/App';
import Grid from './components/Grid';
import Details from './components/Details';
import defaultViewFactory from './views/defaults';
import viewFactory from './views';

import store from './store';

ReactDOM.render(
  <MuiThemeProvider>
    <ViewProvider views={getViews(defaultViewFactory, viewFactory)}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={App}>
            <Route path="/:resourceName" component={Grid} />
            <Route path="/:resourceName/:id" component={Details} />
          </Route>
        </Router>
      </Provider>
    </ViewProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
