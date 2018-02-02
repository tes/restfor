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
import IconButton from 'material-ui/IconButton';
import DetailsIcon from 'material-ui-icons/Pets';
import EditIcon from 'material-ui-icons/Edit';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import { invoke, openDetails, deleteItems } from '../actionCreators';
import {
  getSchema,
  getItems,
  getPage,
  getMaxPage,
  getLimit,
  getResourceName,
  getPathname,
  getSegment
} from '../selectors';
import { getField, getVisibleFields } from './ViewProvider';
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
    const { items } = this.props;
    const itemIds = this.state.selection.map(index => items[index].id);
    await this.props.deleteItems(itemIds);
    this.setState({ selection: [] });
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
    const { schema, items, maxPage, pathname, resourceName, page, invoke, segment } = this.props;
    const { selection } = this.state;
    const fields = getVisibleFields(this.context.views, 'grid', schema, resourceName);
    return (
      <div className="fitted column layout">
        <header className="dynamic column layout">
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography type="title">
                {resourceName.toUpperCase()}{segment && ` / ${segment.toUpperCase()}`}
              </Typography>
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
                      checked={selection.length > 0 && selection.length === items.length}
                      onChange={this.handleAllSelection}
                      indeterminate={selection.length > 0 && selection.length < items.length}
                    />
                  </TableCell>
                  <TableCell />
                  {fields.map(({ name }) => (
                    <TableCell key={name}>
                      <span className="sorter">{name}</span>
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
                    <TableCell>
                      <IconButton aria-label="Delete" onClick={this.handleRowClick(i)}>
                        <DetailsIcon />
                      </IconButton>
                      {/* <IconButton aria-label="Delete" onClick={this.handleRowClick(i)}>
                          <EditIcon />
                      </IconButton> */}
                    </TableCell>

                    {fields.map(({ name: propertyName }) => (
                      <TableCell key={propertyName}>
                        {getField('grid')(this.context.views, resourceName, {
                          propertyName,
                          value: record[propertyName],
                          record,
                          schema,
                          invoke
                        })}
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
    items: getItems(state),
    segment: getSegment(state)
  }),
  { invoke, openDetails, deleteItems }
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
