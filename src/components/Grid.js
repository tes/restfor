import React from 'react';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

class Grid extends React.PureComponent {
  render() {
    return (
      <div className="fitted layout list card">
        <Table ref="table" style={{ overflow: 'hidden' }}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>
                <span className="sorter">NGC</span>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    );
  }
}

export default connect()(Grid);
