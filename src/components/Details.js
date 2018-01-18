import React from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import { closeDetails } from '../actionCreators';

class Details extends React.PureComponent {
  handleEdit = () => {};
  handleRemove = () => {};
  handleCancel = () => this.props.closeDetails();

  render() {
    const { params: { resourceName, id }, schema, record } = this.props;
    return (
      <div className="fitted column layout">
        <header className="dynamic layout">
          <Toolbar style={{ width: '100%' }}>
            <ToolbarGroup>
              <ToolbarTitle text={`${resourceName.toUpperCase()} / ${id}`} />
            </ToolbarGroup>
            <ToolbarGroup>
              <RaisedButton label="Edit" primary onClick={this.handleEdit} />
              <RaisedButton label="Remove" secondary onClick={this.handleRemove} />
              <RaisedButton label="Cancel" onClick={this.handleCancel} />
            </ToolbarGroup>
          </Toolbar>
        </header>
        <main className="fitted column layout">ye</main>
      </div>
    );
  }
}

export default connect(
  ({ schemas, resources }, { params: { resourceName, id } }) => ({
    schema: schemas[resourceName],
    record: resources[resourceName].find(record => record.id === id)
  }),
  { closeDetails }
)(Details);
