import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Menu, { MenuItem } from 'material-ui/Menu';
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
    menuAnchor: null
  };

  handleMenuOpen = event => {
    this.setState({ menuAnchor: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchor: null });
  };

  handleActionClick = ({ name, callback }, actionProps) => () => {
    /* this.handleMenuClose();
    callback({ invoke: this.props.invoke }); */
    console.log(name, callback, actionProps);
  };

  render() {
    const { resourceName, view: viewName, actionProps } = this.props;
    const { menuAnchor } = this.state;
    const actions = getActions(viewName)(this.context.views, resourceName);
    return (
      <div style={{ display: 'inline' }}>
        <Button ref="actionMenu" disabled={actions.length === 0} onClick={this.handleMenuOpen}>
          Actions
        </Button>
        {actions.length > 0 &&
          <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={this.handleMenuClose}>
            {actions.map(action => (
              <MenuItem key={action.name} onClick={this.handleActionClick(action, actionProps)}>
                {action.name}
              </MenuItem>
            ))}
          </Menu>}
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
