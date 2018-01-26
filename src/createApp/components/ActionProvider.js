import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog';
import { invoke } from '../actionCreators';
import { getResourceName } from '../selectors';
import { getActions } from './ViewProvider';
import { getField } from './ViewProvider';

class ActionProvider extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  static propTypes = {
    view: PropTypes.string.isRequired,
    actionProps: PropTypes.object
  };

  state = {
    menuAnchor: null,
    actionOfDialog: null
  };

  handleMenuOpen = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchor: null });
  };

  handleDialogClose = () => {
    this.setState({ actionOfDialog: null });
  };

  handleDialogSubmit = () => {};

  handleActionClick = (action, actionProps) => () => {
    this.handleMenuClose();
    if (!action.params) callback(action.actionProps);
    else this.setState({ actionOfDialog: { ...action, state: {} } });
  };

  handleActionParamChange = paramName => value => {
    const { actionOfDialog } = this.state;
    this.setState({
      ...this.state,
      actionOfDialog: { ...actionOfDialog, state: { ...actionOfDialog.state, [paramName]: value } }
    });
  };

  renderDialog() {
    const { actionOfDialog } = this.state;
    return (
      <Dialog onClose={this.handleDialogClose} open={!!actionOfDialog}>
        {actionOfDialog && <DialogTitle>{actionOfDialog && actionOfDialog.name}</DialogTitle>}
        <div className="param-container">
          <table>
            <tbody>
              {actionOfDialog &&
                actionOfDialog.params &&
                Object.keys(actionOfDialog.params).map(paramName =>
                  this.renderActionParam(actionOfDialog, paramName, actionOfDialog.params[paramName])
                )}
            </tbody>
          </table>
        </div>
        <DialogActions>
          <Button onClick={this.handleDialogClose}>
            Cancel
          </Button>
          <Button onClick={this.handleDialogSubmit} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderActionParam(action, paramName, paramType) {
    return (
      <tr key={paramName}>
        <td>{paramName}</td>
        <td>
          {typeof paramType === 'function' ? this.renderCustomParamComponent(action, paramName, paramType) : null}
        </td>
      </tr>
    );
  }

  renderCustomParamComponent(action, paramName, Component) {
    return (
      <Component
        {...action.actionProps}
        paramName={paramName}
        value={action.state[paramName]}
        onChange={this.handleActionParamChange(paramName)}
        invoke={this.props.invoke}
      />
    );
  }

  renderDefaultParamComponent(action, paramName, paramType) {
    const { resourceName } = this.props;
    return getField('actions')(this.context.views, resourceName, {
      paramName,
      value: action.state[paramName],
      onChange: this.handleActionParamChange(paramName),
      invoke
    });
  }

  renderMenu(actions) {
    const { actionProps } = this.props;
    const { menuAnchor } = this.state;
    return (
      actions.length > 0 &&
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={this.handleMenuClose}>
        {actions.map(action => (
          <MenuItem
            key={action.name}
            onClick={this.handleActionClick(action, actionProps)}
            disabled={action.condition && !action.condition(actionProps || {})}
          >
            {action.name}
          </MenuItem>
        ))}
      </Menu>
    );
  }

  render() {
    const { resourceName, view: viewName, actionProps } = this.props;
    const { menuAnchor, actionOfDialog } = this.state;
    const actions = getActions(viewName)(this.context.views, resourceName);
    return (
      <div style={{ display: 'inline' }}>
        <Button ref="actionMenu" disabled={actions.length === 0} onClick={this.handleMenuOpen}>
          Actions
        </Button>
        {this.renderMenu(actions)}
        {this.renderDialog()}
      </div>
    );
  }
}

export default connect(
  state => ({
    resourceName: getResourceName(state)
  }),
  { invoke }
)(ActionProvider);
