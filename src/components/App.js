import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { fetchSchemas } from '../actionCreators';
import { invoke } from '../actionCreators';
import { getOffsetFromPage } from '../helpers/page';

class App extends React.PureComponent {
  state = {
    isDrawerOpen: false
  };

  async componentDidMount() {
    await this.props.fetchSchemas();
    await this.fetchItems();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.location.pathname !== this.props.location.pathname ||
      prevProps.location.query.page !== this.props.location.query.page
    )
      this.fetchItems();
  }

  fetchItems() {
    const { params: { resourceName, id }, limit, location: { query: { page } } } = this.props;
    if (!resourceName) return;
    if (id && id !== 'new') {
      this.props.invoke('GET', resourceName, '/:id', { params: { id: Number(id) } }, (state, error, result) => {
        if (error) return state;
        if (result) return { ...state, items: [ result ], count: 1 };
        return state;
      });
    } else {
      this.props.invoke(
        'GET',
        resourceName,
        '/',
        { query: { offset: getOffsetFromPage(page, limit), limit } },
        (state, error, result) => {
          if (error) return state;
          if (result) return { ...state, items: result.rows, count: result.count };
          return state;
        }
      );
    }
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
            <Link to={`/${name}?page=1`} key={name} onClick={this.handleToggleDrawer}>
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
  ({ schemas, settings: { limit } }, { resourceName }) => ({ schemaList: Object.keys(schemas), limit }),
  { fetchSchemas, invoke }
)(App);
