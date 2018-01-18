import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/App';

import store from './store';

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path="/:resourceName" component={App} />
        <Route path="/" component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
