import { parse } from 'qs';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import NavigateBefore from 'material-ui-icons/NavigateBefore';
import NavigateNext from 'material-ui-icons/NavigateNext';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { invoke, openDetails } from '../actionCreators';
import { getSchema, getItems, getPage, getMaxPage, getLimit, getResourceName, getPathname } from '../selectors';
import { getField, getAdditionalProperties } from './ViewProvider';
import DeleteDialog from './DeleteDialog';
import ActionProvider from './ActionProvider';

class Grid extends React.PureComponent {
  static contextTypes = {
    views: PropTypes.object
  };

  state = {
    selection: [],
    deleteDialogWindow: false
  };

  fetchItems() {
    const { limit, resourceName, page } = this.props;
    this.props.invoke('GET', resourceName, '/', { query: { offset: page * limit, limit } }, (state, error, result) => {
      if (error) return state;
      if (result) return { ...state, items: result.rows, count: result.count };
      return state;
    });
  }

  handleAllSelection = evt => {
    this.setState({
      selection: evt.target.checked && this.state.selection.length === 0 ? this.props.items.map((_, i) => i) : []
    });
  };

  handleRowSelection = i => evt => {
    const set = new Set(this.state.selection);
    evt.target.checked ? set.add(i) : set.delete(i);
    this.setState({ selection: [...set].sort((a, b) => a - b) });
  };

  handleRemoveItems = async () => {
    const { invoke, items, match: { params: { resourceName } } } = this.props;
    const itemIds = this.state.selection.map(index => items[index].id);
    await invoke('DELETE', resourceName, '/', { body: itemIds });
    this.setState({ selection: [] });
    await this.fetchItems();
  };

  handleRowClick = rowIndex => evt => {
    const id = this.props.items[rowIndex].id;
    this.props.openDetails(id);
  };

  handleConfirmWindow = () => {
    this.setState({ deleteDialogWindow: true });
  };

  handleConfirmClose = answer => {
    this.setState({ deleteDialogWindow: false });
    if (!answer) return false;
    this.handleRemoveItems();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.items !== nextProps.items) {
      this.setState({ selection: [] });
    }
  }

  getSelectedIds() {
    return this.state.selection.map(i => this.props.items[i].id);
  }

  render() {
    const { schema, items, maxPage, pathname, resourceName, page, invoke } = this.props;
    const { selection } = this.state;
    const additionalProperties = getAdditionalProperties(this.context.views, 'grid', schema, resourceName);
    return (
      <div className="fitted column layout">
        <header className="dynamic column layout">
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography type="title">{resourceName.toUpperCase()}</Typography>
              <Link to={`${pathname}/item/new/edit`}>
                <Button raised color="primary" className="left margin">
                  Add
                </Button>
              </Link>
              {selection.length > 0 &&
                <Button raised color="secondary" onClick={this.handleConfirmWindow} className="left margin">
                  Remove selected items
                </Button>}
              <div style={{ marginLeft: 'auto' }}>
                <ActionProvider view="grid" actionProps={{ selection: this.getSelectedIds() }} />
                <PageSwitch direction={-1} disabled={page === 0} to={`${pathname}?page=${page}`} />
                <Button disabled>
                  {page + 1} / {maxPage}
                </Button>
                <PageSwitch
                  direction={+1}
                  disabled={!Number.isFinite(maxPage) || page >= maxPage - 1}
                  to={`${pathname}?page=${page + 2}`}
                />
              </div>
            </Toolbar>
          </AppBar>
        </header>
        {schema &&
          schema.fields &&
          items &&
          <main className="fitted layout overflow">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selection.length === items.length}
                      onChange={this.handleAllSelection}
                      indeterminate={selection.length > 0 && selection.length < items.length}
                    />
                  </TableCell>
                  {[...Object.keys(schema.fields), ...additionalProperties].map(propertyName => (
                    <TableCell key={propertyName}>
                      <span className="sorter">{propertyName}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(items || []).map((record, i) => (
                  <TableRow key={i} role="checkbox" aria-checked={selection.includes(i)} hover selected tabIndex={-1}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selection.includes(i)} onChange={this.handleRowSelection(i)} />
                    </TableCell>
                    {Object.keys(record).map(propertyName => (
                      <TableCell key={propertyName} onClick={this.handleRowClick(i)}>
                        {getField('grid')(this.context.views, resourceName, {
                          propertyName,
                          value: record[propertyName],
                          record,
                          schema,
                          invoke
                        })}
                      </TableCell>
                    ))}
                    {additionalProperties.map(propertyName => (
                      <TableCell key={propertyName}>
                        {getField('grid')(this.context.views, resourceName, { propertyName, record, invoke })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <DeleteDialog isOpened={this.state.deleteDialogWindow} handleClose={this.handleConfirmClose} />

          </main>}
      </div>
    );
  }
}

export default connect(
  state => ({
    pathname: getPathname(state),
    resourceName: getResourceName(state),
    schema: getSchema(state),
    page: getPage(state),
    maxPage: getMaxPage(state),
    limit: getLimit(state),
    items: getItems(state)
  }),
  { invoke, openDetails }
)(Grid);

class PageSwitch extends React.PureComponent {
  static propTypes = {
    direction: PropTypes.number,
    disabled: PropTypes.bool,
    to: PropTypes.string
  };

  render() {
    const { direction, disabled, to } = this.props;
    const icon = direction === -1 ? <NavigateBefore /> : <NavigateNext />;
    return disabled
      ? <Button disabled>{icon}</Button>
      : <Link to={to}>
          <Button icon={icon}>{icon}</Button>
        </Link>;
  }
}
