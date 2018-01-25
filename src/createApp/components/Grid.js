import { parse } from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import NavigateBefore from 'material-ui-icons/NavigateBefore';
import NavigateNext from 'material-ui-icons/NavigateNext';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { invoke, openDetails } from '../actionCreators';
import { getMaxPage } from '../selectors';
import { resolvePage, getOffsetFromPage } from '../helpers/page';
import { getComponent, getAdditionalProperties } from './ViewProvider';

class Grid extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  state = {
    selection: []
  };

  fetchItems() {
    const { limit, match: { params: { resourceName } }, location: { search } } = this.props;
    const { page } = parse(search.substr(1));
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

  handleAllSelection = evt => {
    this.setState({
      selection: evt.target.checked && this.state.selection.length === 0 ? this.props.items.map((_, i) => i) : []
    });
  };

  handleRowSelection = i => evt => {
    const set = new Set(this.state.selection);
    evt.target.checked ? set.add(i) : set.delete(i);
    this.setState({ selection: [ ...set ] });
  };

  handleRemoveItems = async () => {
    const { invoke, items, match: { params: { resourceName } } } = this.props;
    const itemIds = this.state.selection.map(index => items[index].id);
    await invoke('DELETE', resourceName, '/', { body: itemIds });
    this.setState({ selection: [] });
    await this.fetchItems();
  };

  handleRowClick = (rowIndex, cellIndex) => {
    if (cellIndex === -1) return;
    const id = this.props.items[rowIndex].id;
    this.props.openDetails(id);
  };

  render() {
    const {
      schema,
      items,
      maxPage,
      location: { pathname },
      match: { params: { resourceName } },
      location: { search }
    } = this.props;
    const { page: rawPage } = parse(search.substr(1));
    const page = resolvePage(rawPage);
    const { selection } = this.state;
    const additionalProperties = getAdditionalProperties(this.context.views, 'grid', schema, resourceName);
    return (
      <div className="fitted column layout">
        <header className="dynamic column layout">
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography type="title">{resourceName.toUpperCase()}</Typography>
              <Link to={`/${resourceName}/new`}>
                <Button raised color="primary" className="left margin">
                  Add
                </Button>
              </Link>
              {selection.length > 0 && (
                <Button raised color="secondary" onClick={this.handleRemoveItems} className="left margin">
                  Remove selected items
                </Button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                <PageSwitch direction={-1} disabled={page === 0} to={`${pathname}?page=${page}`} />
                <Button disabled>
                  {page + 1} / {maxPage}
                </Button>
                <PageSwitch direction={+1} disabled={page >= maxPage - 1} to={`${pathname}?page=${page + 2}`} />
              </div>
            </Toolbar>
          </AppBar>
        </header>
        <main className="fitted layout overflow">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selection.length === items.length}
                    onChange={this.handleAllSelection}
                    indeterminate={selection.length > 0 && selection.length < items.length}
                  />
                </TableCell>
                {[ ...Object.keys(schema), ...additionalProperties ].map(propertyName => (
                  <TableCell key={propertyName}>
                    <span className="sorter">{propertyName}</span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((record, i) => (
                <TableRow key={i} role="checkbox" aria-checked={selection.includes(i)} hover selected tabIndex={-1}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selection.includes(i)} onChange={this.handleRowSelection(i)} />
                  </TableCell>
                  {Object.keys(record).map(propertyName => (
                    <TableCell key={propertyName}>
                      {getComponent('grid')(this.context.views, resourceName, {
                        propertyName,
                        value: record[propertyName],
                        record,
                        schema
                      })}
                    </TableCell>
                  ))}
                  {additionalProperties.map(propertyName => (
                    <TableCell key={propertyName}>
                      {getComponent('grid')(this.context.views, resourceName, { propertyName, record })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    );
  }
}

export default connect(
  (state, { match: { params: { resourceName } } }) => {
    const { resources: { [resourceName]: resource }, schemas, settings: { limit } } = state;
    const { items, page } = resource || { items: [], page: 0 };
    const schema = schemas[resourceName] || {};
    const maxPage = getMaxPage(resourceName)(state);
    return { schema, items, page, maxPage, limit };
  },
  { invoke, openDetails }
)(Grid);

class PageSwitch extends React.PureComponent {
  static propTypes = {
    direction: PropTypes.number,
    disabled: PropTypes.bool,
    to: PropTypes.string
  };

  render() {
    const { direction, disabled, to } = this.props;
    const icon = direction === -1 ? <NavigateBefore /> : <NavigateNext />;
    return disabled ? (
      <Button disabled>{icon}</Button>
    ) : (
      <Link to={to}>
        <Button icon={icon}>{icon}</Button>
      </Link>
    );
  }
}
