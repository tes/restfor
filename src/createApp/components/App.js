import { parse } from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Link } from 'react-router-dom';
import Toolbar from 'material-ui/Toolbar';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import { fetchSchemas } from '../actionCreators';
import { invoke } from '../actionCreators';
import { getOffsetFromPage } from '../helpers/page';
import Grid from './Grid';
import Details from './Details';

class App extends React.PureComponent {
  async componentDidMount() {
    await this.props.fetchSchemas();
    await this.fetchItems();
  }

  componentDidUpdate(prevProps) {
    const prevQuery = parse(prevProps.location.search.substr(1));
    const query = parse(this.props.location.search.substr(1));
    if (prevProps.location.pathname !== this.props.location.pathname || prevQuery.page !== query.page)
      this.fetchItems();
  }

  fetchItems() {
    const { items, match: { params: { resourceName, id } }, limit, location: { search } } = this.props;
    const { page } = parse(search.substr(1));
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
    const { schemaList, match: { params: { resourceName } }, history } = this.props;
    return (
      <div className="absolute column layout App">
        <header className="dynamic high">
          <AppBar position="static">
            <Toolbar>
              <Typography type="title" color="inherit">
                Restfor
              </Typography>
            </Toolbar>
          </AppBar>
        </header>
        <div className="fitted row low layout">
          {/* <nav className="dynamic column high layout">
            
          </nav> */}
          <nav className="dynamic column high layout">
            <List>
              {schemaList.map(name => (
                <Link to={`/${name}?page=1`} key={name}>
                  <ListItem button disabled={name === resourceName}>
                    <ListItemText primary={name.toUpperCase()} />
                  </ListItem>
                </Link>
              ))}
            </List>
          </nav>
          {/* <main className="relative fitted layout">
            <Router history={history}>
              <div className="fitted column layout">
                <Route exact path="/:resourceName" component={Grid} />
                <Route exact path="/:resourceName/:id" component={Details} />
              </div>
            </Router>
          </main> */}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ schemas, resources, settings: { limit } }, { match: { params: { resourceName } } }) => ({
    schemaList: Object.keys(schemas),
    limit,
    items: resources[resourceName] && resources[resourceName].items
  }),
  { fetchSchemas, invoke }
)(App);
