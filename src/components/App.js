import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { fetchSchemas, switchResource } from '../actionCreators';

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

  handleSchemaClick = resourceName => () => {
    this.props.switchResource(resourceName);
    this.handleToggleDrawer();
  };

  render() {
    const { schemaList, params: { resourceName }, children } = this.props;
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
          {schemaList.map(name => (
            <MenuItem key={name} onClick={this.handleSchemaClick(name)} disabled={name === resourceName}>
              {name.toUpperCase()}
            </MenuItem>
          ))}
        </Drawer>
        <main className="relative fitted layout">{children}</main>
      </div>
    );
  }
}

export default connect(({ schemas, isFetching }) => ({ schemaList: Object.keys(schemas), isFetching }), {
  fetchSchemas,
  switchResource
})(App);
