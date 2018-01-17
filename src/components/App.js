import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import './App.css';

class App extends Component {
  state = {
    isDrawerOpen: false
  };

  handleToggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen });
  };

  render() {
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
      </div>
    );
  }
}

export default App;
