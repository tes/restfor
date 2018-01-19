import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import { fetchSchemas } from '../actionCreators';
import { invoke } from '../actionCreators';
import { getOffsetFromPage } from '../helpers/page';
import './App.css';

class App extends React.PureComponent {
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
    const { items, params: { resourceName, id }, limit, location: { query: { page } } } = this.props;
    if (!resourceName) return;
    if (id && id !== 'new') {
      if (items && items.find(item => item.id === Number(id))) return;
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

  render() {
    const { schemaList, params: { resourceName }, children } = this.props;
    return (
      <div className="absolute column layout App">
        <header className="dynamic">
          <AppBar title="Restfor" showMenuIconButton={false} />
        </header>
        <div className="fitted row layout">
          <nav className="dynamic column high layout">
            {schemaList.map(name => (
              <Link to={`/${name}?page=1`} key={name}>
                <MenuItem disabled={name === resourceName}>{name.toUpperCase()}</MenuItem>
              </Link>
            ))}
          </nav>
          <main className="relative fitted layout">{children}</main>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ schemas, resources, settings: { limit } }, { params: { resourceName } }) => ({
    schemaList: Object.keys(schemas),
    limit,
    items: resources[resourceName] && resources[resourceName].items
  }),
  { fetchSchemas, invoke }
)(App);
