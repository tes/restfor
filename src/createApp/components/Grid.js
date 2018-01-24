import { parse } from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
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

  handleRowSelection = selections => {
    const selection =
      typeof selections === 'string' ? (selections === 'none' ? [] : this.props.items.map((_, i) => i)) : selections;
    this.setState({ selection });
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
        <header className="dynamic layout">
          <Toolbar style={{ width: '100%' }}>
            <ToolbarGroup>
              <ToolbarTitle text={resourceName.toUpperCase()} />
              <Link to={`/${resourceName}/new`}>
                <RaisedButton label="Add" primary />
              </Link>
              {selection.length > 0 && (
                <RaisedButton label="Remove selected items" secondary onClick={this.handleRemoveItems} />
              )}
            </ToolbarGroup>
            <ToolbarGroup>
              <PageSwitch direction={-1} disabled={page === 0} to={`${pathname}?page=${page}`} />
              <FlatButton disabled>
                {page + 1} / {maxPage}
              </FlatButton>
              <PageSwitch direction={+1} disabled={page >= maxPage - 1} to={`${pathname}?page=${page + 2}`} />
            </ToolbarGroup>
          </Toolbar>
        </header>
        <main className="fitted layout">
          <Table
            height={'calc(100% - 59px)'}
            wrapperStyle={{ height: '100%' }}
            multiSelectable
            fixedHeader
            onRowSelection={this.handleRowSelection}
            onCellClick={this.handleRowClick}
          >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                {[ ...Object.keys(schema), ...additionalProperties ].map(propertyName => (
                  <TableHeaderColumn key={propertyName}>
                    <span className="sorter">{propertyName}</span>
                  </TableHeaderColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false} showRowHover>
              {(items || []).map((record, i) => (
                <TableRow key={i} selected={selection.includes(i)}>
                  {Object.keys(record).map(propertyName => (
                    <TableRowColumn key={propertyName}>
                      {getComponent('grid')(this.context.views, resourceName, {
                        propertyName,
                        value: record[propertyName],
                        record,
                        schema
                      })}
                    </TableRowColumn>
                  ))}
                  {additionalProperties.map(propertyName => (
                    <TableRowColumn key={propertyName}>
                      {getComponent('grid')(this.context.views, resourceName, { propertyName, record })}
                    </TableRowColumn>
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
    const icon = direction === -1 ? <ArrowBack /> : <ArrowForward />;
    return disabled ? (
      <FlatButton icon={icon} disabled />
    ) : (
      <Link to={to}>
        <FlatButton icon={icon} />
      </Link>
    );
  }
}
