import React from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import Check from 'material-ui/svg-icons/navigation/check';
import Chip from 'material-ui/Chip';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { invoke, openDetails } from '../actionCreators';
import { getMaxPage } from '../selectors';

const BACK = Symbol();
const FORWARD = Symbol();

class Grid extends React.PureComponent {
  state = {
    selection: []
  };

  fetchItems(resourceName, limit, page) {
    this.props.invoke('GET', resourceName, '/', { query: { offset: page * limit, limit } }, (state, error, result) => {
      if (error) return state;
      if (result) return { ...state, items: result.rows, count: result.count, page };
      return state;
    });
  }

  handlePagination = direction => () => {
    const { params: { resourceName }, page, limit } = this.props;
    const nextPage = page + (direction === FORWARD ? +1 : -1);
    this.fetchItems(resourceName, limit, nextPage);
  };

  handleRowSelection = selections => {
    const selection =
      typeof selections === 'string' ? (selections === 'none' ? [] : this.props.items.map((_, i) => i)) : selections;
    this.setState({ selection });
  };

  handleRemoveItems = async () => {
    const { invoke, items, limit, page, params: { resourceName } } = this.props;
    const itemIds = this.state.selection.map(index => items[index].id);
    await invoke('DELETE', resourceName, '/', { body: itemIds }, (state, error, result) => {
      console.log(result);
      return state;
    });
    await this.fetchItems(resourceName, limit, page);
  };

  handleRowClick = (rowIndex, cellIndex) => {
    if (cellIndex === -1) return;
    const id = this.props.items[rowIndex].id;
    this.props.openDetails(this.props.params.resourceName, id);
  };

  render() {
    const { schema, items, page, maxPage, params: { resourceName } } = this.props;
    const { selection } = this.state;
    return (
      <div className="fitted column layout">
        <header className="dynamic layout">
          <Toolbar style={{ width: '100%' }}>
            <ToolbarGroup>
              <ToolbarTitle text={resourceName.toUpperCase()} />
              {selection.length > 0 && (
                <RaisedButton label="Remove selected items" secondary onClick={this.handleRemoveItems} />
              )}
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton icon={<ArrowBack />} disabled={page === 0} onClick={this.handlePagination(BACK)} />
              <FlatButton disabled>
                {page + 1} / {maxPage}
              </FlatButton>
              <FlatButton
                icon={<ArrowForward />}
                disabled={page >= maxPage - 1}
                onClick={this.handlePagination(FORWARD)}
              />
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
                {Object.keys(schema).map(propertyName => (
                  <TableHeaderColumn key={propertyName}>
                    <span className="sorter">{propertyName}</span>
                  </TableHeaderColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false}>
              {(items || []).map((item, i) => (
                <TableRow key={i} selected={selection.includes(i)}>
                  {Object.keys(item).map(propertyName => (
                    <TableRowColumn key={propertyName}>
                      {getCellComponent(schema[propertyName], item[propertyName])}
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

const getCellComponent = (schema, value) => {
  switch (schema.type) {
    case 'BOOLEAN':
      return value ? <Check /> : '';
    case 'ENUM':
      return <Chip>{value}</Chip>;
    case 'DATE':
      return new Date(value).toLocaleString();
    default:
      return value;
  }
};

export default connect(
  (state, { params: { resourceName } }) => {
    const { resources: { [resourceName]: resource }, schemas, settings: { limit } } = state;
    const { items, page } = resource || { items: null, page: 0 };
    const schema = schemas[resourceName] || {};
    const maxPage = getMaxPage(resourceName)(state);
    return { schema, items, page, maxPage, limit };
  },
  { invoke, openDetails }
)(Grid);
