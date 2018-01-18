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
    if (isActive && !items) invoke('GET', resourceName, '/');
  }

  render() {
    const { schema, items } = this.props;
    return (
      <div className="fitted layout list card">
        <Table ref="table" style={{ overflow: 'hidden' }}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
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
                  {Object.keys(item).map(propertyName => <TableRowColumn>{item[propertyName]}</TableRowColumn>)}
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
