import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function YesNoDialog({ open, title, question, cancelLabel, confirmLabel, onClose, onConfirm }) {
  
  const handleCancel = () => {
    onClose();
  }

  const handleConfirm = () => {
    onClose();
    onConfirm();
  }

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {question}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}