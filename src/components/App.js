import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import ResourceTabs from './ResourceTabs';
import { fetchSchemas } from '../actionCreators';

class App extends React.PureComponent {
  state = {
    isDrawerOpen: false
  };

  componentDidMount() {
    this.props.fetchSchemas();
  }

  handleToggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  };

  render() {
    return (
      <div className="absolute column layout">
        <header className="dynamic">
          <AppBar
            title="Restfor"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonClick={this.handleToggleDrawer}
          />
        </header>
        <Drawer open={this.state.isDrawerOpen} docked={false} onRequestChange={this.handleToggleDrawer}>
          <MenuItem onClick={this.handleToggleDrawer}>Menu Item</MenuItem>
          <MenuItem onClick={this.handleToggleDrawer}>Menu Item 2</MenuItem>
        </Drawer>
        <main className="relative fitted layout">
          <Router history={hashHistory}>
            <Route path="/:resource" component={ResourceTabs} />
          </Router>
        </main>
      </div>
    );
  }
}

export default connect(({ isFetching }) => ({ isFetching }), { fetchSchemas })(App);
