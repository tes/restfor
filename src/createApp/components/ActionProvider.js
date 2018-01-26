import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
import Dialog, { DialogTitle } from 'material-ui/Dialog';
import { invoke } from '../actionCreators';
import { getResourceName } from '../selectors';
import { getActions } from './ViewProvider';

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
    dialogForAction: null
  };

  handleMenuOpen = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchor: null });
  };

  handleDialogClose = () => {
    this.setState({ dialogForAction: null });
  };

  handleActionClick = (action, actionProps) => () => {
    this.handleMenuClose();
    if (!action.params) callback(action.actionProps);
    else this.setState({ dialogForAction: action });
  };

  renderDialog() {
    const { dialogForAction } = this.state;
    return (
      <Dialog onClose={this.handleDialogClose} open={!!dialogForAction}>
        {dialogForAction && <DialogTitle>{dialogForAction && dialogForAction.name}</DialogTitle>}
        <div className="param-container">
          yee
        </div>
      </Dialog>
    );
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
    const { menuAnchor, dialogForAction } = this.state;
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
