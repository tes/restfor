import React, { PureComponent } from 'react';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

class DeleteDialog extends PureComponent {

  render() {
    return(
      <Dialog fullScreen={false} open={this.props.isOpened} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{'Are you sure?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.props.handleClose(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              this.props.handleClose(true);
            }}
            color="primary"
            autoFocus
          >
            Yes, delete it!
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

}

export default DeleteDialog;