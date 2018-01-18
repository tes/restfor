import React from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { invoke } from '../actionCreators';

class Grid extends React.PureComponent {
  componentDidMount() {
    this.ensureItems();
  }

  componentDidUpdate() {
    this.ensureItems();
  }

  ensureItems() {
    const { isActive, items, invoke, resourceName } = this.props;
    if (isActive && !items)
      invoke('GET', resourceName, '/', (state, error, result) => {
        if (error) return { ...state, items: null, count: 0, page: 0 };
        if (result) return { ...state, items: result.rows, count: result.count, page: 0 };
        return state;
      });
  }

  render() {
    const { schema, items } = this.props;
    return (
      <div className="fitted layout">
        <Table height={'calc(100% - 59px)'} wrapperStyle={{ height: '100%' }} multiSelectable fixedHeader>
          <TableHeader enableSelectAll>
            <TableRow>
              {Object.keys(schema).map(propertyName => (
                <TableHeaderColumn key={propertyName}>
                  <span className="sorter">{propertyName}</span>
                </TableHeaderColumn>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(items || [])
              .map(item => (
                <TableRow key={item.id}>
                  {Object.keys(item).map(propertyName => (
                    <TableRowColumn key={propertyName}>{item[propertyName]}</TableRowColumn>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default connect(
  ({ resources, schemas }, { resourceName }) => {
    const { items, page } = resources[resourceName] || { items: null, page: null };
    const schema = schemas[resourceName] || {};
    return { schema, items, page };
  },
  { invoke }
)(Grid);
