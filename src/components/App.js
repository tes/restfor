import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
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
            <Link to={`/${name}`} key={name} onClick={this.handleToggleDrawer}>
              <MenuItem disabled={name === resourceName}>{name.toUpperCase()}</MenuItem>
            </Link>
          ))}
        </Drawer>
        <main className="relative fitted layout">{children}</main>
      </div>
    );
  }
}

export default connect(({ schemas, isFetching }) => ({ schemaList: Object.keys(schemas), isFetching }), {
  fetchSchemas
})(App);
