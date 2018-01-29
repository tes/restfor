import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isDeepEqual from 'deep-equal';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { invoke, closeDetails } from '../actionCreators';
import { getType } from '../helpers/types';
import { getComponent, getAdditionalProperties } from './ViewProvider';
import { getRecord, getSchema, getId, getResourceName } from '../selectors';

class Editor extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  state = { record: this.getDefaultState() };

  getDefaultState() {
    const { record, schema } = this.props;
    return record
      ? record
      : schema
          ? Object.keys(schema).reduce(
              (record, propertyName) =>
                (schema[propertyName].autoGenerated
                  ? record
                  : {
                      ...record,
                      [propertyName]: getDefaultValue(propertyName, schema[propertyName])
                    }),
              null
            )
          : null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.record !== this.props.record || prevProps.schema !== this.props.schema)
      this.setState({ record: this.getDefaultState() });
  }

  handleChange = propertyName => value => this.setState({ record: { ...this.state.record, [propertyName]: value } });

  handleSave = async () => {
    const { invoke, closeDetails, resourceName, id } = this.props;
    const { record } = this.state;
    if (id === 'new') {
      await invoke('POST', resourceName, '/', { body: [record] });
      closeDetails();
    } else {
      await invoke('PUT', resourceName, '/:id', { params: { id }, body: record }, (state, error, result) => {
        if (error) return state;
        if (result) return { ...state, items: state.items.map(item => (item.id === id ? result : item)) };
        return state;
      });
    }
  };

  handleClose = () => this.props.closeDetails();

  isSaveButtonDisabled() {
    const { record } = this.state;
    return !!record && isDeepEqual(record, this.props.record);
  }

  render() {
    const { resourceName, id, schema, invoke } = this.props;
    const { record } = this.state;
    const additionalProperties = getAdditionalProperties(this.context.views, 'editor', schema, resourceName);
    return (
      <div className="fitted column layout Editor">
        <header className="dynamic layout">
          <AppBar position="static" color="default">
            <Toolbar style={{ width: '100%' }}>
              <Typography type="title">{`${resourceName.toUpperCase()} / ${id.toString().toUpperCase()}`}</Typography>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  raised
                  color="primary"
                  onClick={this.handleSave}
                  disabled={this.isSaveButtonDisabled()}
                  className="left margin"
                >
                  Save
                </Button>
                <Button raised className="left margin" onClick={this.handleClose}>
                  Close
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </header>
        <main className="fitted column layout overflow-y">
          {schema &&
            record &&
            <table>
              <tbody>
                {Object.keys(schema).map(
                  propertyName =>
                    !(id === 'new' && schema[propertyName].autoGenerated) &&
                    <tr key={propertyName}>
                      <td>
                        <b>{propertyName}</b>
                      </td>
                      <td>
                        {getComponent('editor')(this.context.views, resourceName, {
                          propertyName,
                          value: record[propertyName],
                          record,
                          schema,
                          onChange: this.handleChange(propertyName),
                          invoke
                        })}
                      </td>
                    </tr>
                )}
                {additionalProperties.map(
                  propertyName =>
                    id !== 'new' &&
                    <tr key={propertyName}>
                      <td>
                        <b>{propertyName}</b>
                      </td>
                      <td>
                        {getComponent('editor')(this.context.views, resourceName, {
                          propertyName,
                          record,
                          invoke
                        })}
                      </td>
                    </tr>
                )}
              </tbody>
            </table>}
        </main>
      </div>
    );
  }
}

const getDefaultValue = (propertyName, schema) => {
  switch (schema.type) {
    case 'BOOLEAN':
      return false;
    case 'DATE':
      return new Date().toISOString();
    case 'ENUM':
      return (schema.values && schema.values[0]) || null;
    default:
      return getType(schema.type) === 'number' ? 1 : '';
  }
};

export default connect(
  state => ({
    id: getId(state),
    resourceName: getResourceName(state),
    schema: getSchema(state),
    record: getRecord(state)
  }),
  { invoke, closeDetails }
)(Editor);
