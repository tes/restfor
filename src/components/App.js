import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import './App.css';
import { fetchEntities } from '../actionCreators';

class App extends Component {
  state = {
    isDrawerOpen: false
  };

  componentDidMount() {
    this.props.fetchEntities();
  }

  handleToggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  };

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
          {entities.map(entity => (
            <MenuItem key={entity} onClick={this.handleToggleDrawer}>
              {entity}
            </MenuItem>
          ))}
        </Drawer>
      </div>
    );
  }
}

export default connect(({ entities, isFetching }) => ({ entities, isFetching }), { fetchEntities })(App);
