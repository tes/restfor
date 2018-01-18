import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { fetchSchemas } from '../actionCreators';
import { invoke } from '../actionCreators';

class App extends React.PureComponent {
  state = {
    isDrawerOpen: false
  };

  async componentDidMount() {
    await this.props.fetchSchemas();
    await this.ensureItems();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) this.ensureItems();
  }

  ensureItems() {
    const { params: { resourceName }, limit, page } = this.props;
    if (resourceName) this.fetchItems(resourceName, limit, page);
  }

  fetchItems(resourceName, limit, page) {
    this.props.invoke('GET', resourceName, '/', { query: { offset: page * limit, limit } }, (state, error, result) => {
      if (error) return state;
      if (result) return { ...state, items: result.rows, count: result.count, page };
      return state;
    });
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

export default connect(
  (state, { resourceName }) => {
    const { resources: { [resourceName]: { page } = { page: 0 } }, schemas, settings: { limit } } = state;
    return { schemaList: Object.keys(schemas), page, limit };
  },
  { fetchSchemas, invoke }
)(App);
