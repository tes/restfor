import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import ViewProvider, { getViews } from './components/ViewProvider';
import App from './components/App';
import defaultViewFactory from './views/defaults';
import viewFactory from './views';
import hashHistory from './hashHistory';
import store from './store';

ReactDOM.render(
  <MuiThemeProvider>
    <ViewProvider views={getViews(defaultViewFactory, viewFactory)}>
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/:resourceName?/:id?" component={App} />
        </Router>
      </Provider>
    </ViewProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
