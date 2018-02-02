import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isDeepEqual from 'deep-equal';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import { invoke, closeDetails, createItem, updateItem } from '../actionCreators';
import { getField, getAdditionalProperties } from './ViewProvider';
import { getRecord, getSchema, getId, getResourceName, getSegment } from '../selectors';

class Editor extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  state = { record: this.getDefaultState() };

  getDefaultState() {
    const { record, schema } = this.props;
    return record
      ? record
      : schema && schema.fields
          ? Object.keys(schema.fields).reduce(
              (record, propertyName) =>
                (schema.fields[propertyName].autoGenerated
                  ? record
                  : {
                      ...record,
                      [propertyName]: getDefaultValue(schema.fields[propertyName])
                    }),
              null
            )
          : null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.record !== this.props.record || prevProps.schema !== this.props.schema)
      this.setState({ record: this.getDefaultState() });
  }

  handleChange = propertyName => arg => {
    if (typeof arg === 'function') this.setState({ record: arg(this.state.record) });
    else this.setState({ record: { ...this.state.record, [propertyName]: arg } });
  };

  handleSave = async () => {
    const { invoke, closeDetails, resourceName, id, schema } = this.props;
    const record = Object.keys(schema.fields).reduce(
      (record, name) => (schema.fields[name].readOnly ? record : { ...record, [name]: this.state.record[name] }),
      {}
    );
    if (id === 'new') {
      await this.props.createItem(record);
      closeDetails();
    } else {
      await this.props.updateItem(record);
    }
  };

  handleClose = () => this.props.closeDetails();

  isSaveButtonDisabled() {
    const { record } = this.state;
    return !!record && isDeepEqual(record, this.props.record);
  }

  render() {
    const { resourceName, segment, id, schema, invoke } = this.props;
    const { record } = this.state;
    const title = `${resourceName.toUpperCase()}${segment ? ' / ' + segment.toUpperCase() : ''} / ${id
      .toString()
      .toUpperCase()}`;
    const additionalProperties = getAdditionalProperties(this.context.views, 'editor', schema, resourceName);
    return (
      <div className="fitted column layout Editor">
        <header className="dynamic layout">
          <AppBar position="static" color="default">
            <Toolbar style={{ width: '100%' }}>
              <Typography type="title">{title}</Typography>
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
            schema.fields &&
            record &&
            <table>
              <tbody>
                {Object.keys(schema.fields).map(
                  propertyName =>
                    !(id === 'new' && schema.fields[propertyName].readOnly) &&
                    <tr key={propertyName}>
                      <td>
                        <b>{propertyName}</b>
                      </td>
                      <td>
                        {getField('editor')(this.context.views, resourceName, {
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
                        {getField('editor')(this.context.views, resourceName, {
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

const getDefaultValue = schema => {
  switch (schema.type) {
    case 'bool':
      return false;
    case 'date':
      return new Date().toISOString();
    case 'enum':
      return (schema.values && schema.values[0]) || null;
    default:
      return schema.type === 'number' ? 1 : '';
  }
};

export default connect(
  state => ({
    id: getId(state),
    resourceName: getResourceName(state),
    schema: getSchema(state),
    record: getRecord(state),
    segment: getSegment(state)
  }),
  { invoke, closeDetails, createItem, updateItem }
)(Editor);
