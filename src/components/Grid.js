import React from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { invoke } from '../actionCreators';
import { getMaxPage } from '../selectors';

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
        if (result) return { ...state, items: result.rows, count: result.count, page: 1 };
        return state;
      });
  }

  render() {
    const { schema, items, page, maxPage } = this.props;
    return (
      <div className="fitted column layout">
        <header className="dynamic layout">
          <Toolbar style={{ width: '100%' }}>
            <ToolbarGroup>
              <RaisedButton label="Remove selected items" secondary />
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton icon={<ArrowBack />} disabled={page === 1} />
              <FlatButton disabled>
                {page} / {maxPage}
              </FlatButton>
              <FlatButton icon={<ArrowForward />} disabled={page === maxPage} />
            </ToolbarGroup>
          </Toolbar>
        </header>
        <main className="fitted layout">
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
        </main>
      </div>
    );
  }
}

export default connect(
  (state, { resourceName }) => {
    const { resources, schemas } = state;
    const { items, page } = resources[resourceName] || { items: null, page: null };
    const schema = schemas[resourceName] || {};
    const maxPage = getMaxPage(resourceName)(state);
    return { schema, items, page, maxPage };
  },
  { invoke }
)(Grid);
