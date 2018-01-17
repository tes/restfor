import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Tabs, Tab } from 'material-ui/Tabs';
import './App.css';
import { fetchEntities } from '../actionCreators';

class App extends Component {
  state = {
    isDrawerOpen: false,
    tab: null
  };

  componentDidMount() {
    this.props.fetchEntities();
  }

  componentWillUpdate(nextProps) {
    if (this.props.entities !== nextProps.entities && nextProps.entities.length > 0) {
      this.setState({ tab: nextProps.entities[0].toLowerCase() });
    }
  }

  handleToggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  };

  handleTabChange = value => this.setState({ tab: value });

  render() {
    const { entities } = this.props;
    return (
      <div className="App">
        <AppBar
          title="Restfor"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={this.handleToggleDrawer}
        />
        <Drawer open={this.state.isDrawerOpen} docked={false} onRequestChange={this.handleToggleDrawer}>
          <MenuItem onClick={this.handleToggleDrawer}>Menu Item</MenuItem>
          <MenuItem onClick={this.handleToggleDrawer}>Menu Item 2</MenuItem>
        </Drawer>
        <Tabs value={this.state.tab} onChange={this.handleTabChange}>
          {entities.map(entity => (
            <Tab label={entity} value={entity.toLowerCase()}>
              <div>
                <h2>{entity}</h2>
                <p>
                  Tabs are also controllable if you want to programmatically pass them their values. This allows for
                  more functionality in Tabs such as not having any Tab selected or assigning them different values.
                </p>
              </div>
            </Tab>
          ))}
        </Tabs>
      </div>
    );
  }
}

export default connect(({ entities, isFetching }) => ({ entities, isFetching }), { fetchEntities })(App);
