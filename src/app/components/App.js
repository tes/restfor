import { parse } from 'qs';
import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Link } from 'react-router-dom';
import Toolbar from 'material-ui/Toolbar';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';
import ChevronRight from 'material-ui-icons/ChevronRight';
import Snackbar from 'material-ui/Snackbar';
import { MenuItem } from 'material-ui/Menu';
import PropTypes from 'prop-types';
import { fetchSchemas, fetchItems, fetchItem, dismissError } from '../actionCreators';
import classnames from 'classnames';
import {
  getPage,
  getResourceName,
  getId,
  getItems,
  getLimit,
  getSchemaList,
  getSegment,
  getSchemas,
  getVisibleSchemas
} from '../selectors';
import Grid from './Grid';
import Details from './Details';
import Editor from './Editor';

class ViewShell extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  render() {
    const { views } = this.context;
    const { resourceName, view } = this.props.match.params;
    const Component = views[`${resourceName}-${view}`] || views[`*-${view}`] || Details;
    return <Component {...this.props} />;
  }
}

const SchemaMenuItem = ({ schema, resourceName, segment }) => {
  const { name, segments } = schema;
  const isActiveResource = name.toLowerCase() === resourceName && !segment;
  const hasActiveSegment = name.toLowerCase() === resourceName;
  return (
    <div>
      <Link to={`/${name.toLowerCase()}?page=1`} key={name}>
        <ListItem button disabled={isActiveResource} className={classnames(isActiveResource && 'active-item')}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={name.toUpperCase()} />
        </ListItem>
      </Link>
      {!!segments &&
        hasActiveSegment &&
        segments.map(({ segmentKey }) => (
          <Link to={`/${name.toLowerCase()}/segment/${segmentKey}?page=1`} key={segmentKey}>
            <ListItem
              button
              disabled={segment === segmentKey}
              className={classnames(segment === segmentKey && 'active-item')}
            >
              <ListItemIcon>
                <ChevronRight />
              </ListItemIcon>
              <ListItemText primary={segmentKey} />
            </ListItem>
          </Link>
        ))}
    </div>
  );
};

class App extends React.PureComponent {
  async componentDidMount() {
    await this.props.fetchSchemas();
    await this.ensureItems();
  }

  static contextTypes = {
    views: PropTypes.object
  };

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname || prevProps.page !== this.props.page)
      this.ensureItems();
  }

  ensureItems() {
    const { items, resourceName, id } = this.props;
    if (!resourceName) return;
    if (id && id !== 'new') {
      if (items && items.find(item => item.id === Number(id))) return;
      this.props.fetchItem();
    } else {
      this.props.fetchItems();
    }
  }

  closeSnackBar = () => {
    this.props.dismissError();
  };

  render() {
    const { resourceName, history, error, schemas, segment } = this.props;
    return (
      <div className="absolute column layout App">
        <div className="fitted row low layout">
          <nav className="dynamic column high shadowed layout overflow">
            <List component="nav">
              {schemas.map((schema, index) => (
                <SchemaMenuItem key={index} resourceName={resourceName} schema={schema} segment={segment} />
              ))}
            </List>
          </nav>
          <Router history={history}>
            <main className="relative fitted column low layout">
              <Route exact path="/:resourceName" component={Grid} />
              <Route exact path="/:resourceName/segment/:segment" component={Grid} />
              <Route exact path="/:resourceName/item/:id/:view?" component={ViewShell} />
              <Route exact path="/:resourceName/segment/:segment/item/:id/:view?" component={ViewShell} />
            </main>
          </Router>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={!!error}
          onClose={this.closeSnackBar}
          autoHideDuration={7000}
          SnackbarContentProps={{ 'aria-describedby': 'message-id' }}
          message={<span id="message-id">{error ? error : 'Something wrong'}</span>}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    schemaList: getSchemaList(state),
    schemas: getVisibleSchemas(state),
    limit: getLimit(state),
    items: getItems(state),
    page: getPage(state),
    resourceName: getResourceName(state),
    segment: getSegment(state),
    id: getId(state),
    error: state.error
  }),
  { fetchSchemas, fetchItems, fetchItem, dismissError }
)(App);
