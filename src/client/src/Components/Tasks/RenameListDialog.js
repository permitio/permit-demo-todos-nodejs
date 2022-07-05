import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RenameListDialog({ open, initialName, onClose, onSave }) {
  const [name, setName] = useState(initialName);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSave = () => {
    onClose();

    if (name !== initialName) {
      onSave(name);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} aria-labelledby="form-dialog-title" 
      fullWidth={true} maxWidth={'sm'}>
      <DialogTitle id="form-dialog-title">Rename List</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a different list name
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Task List Name"
          type="text"
          fullWidth
          defaultValue={initialName}
          onChange={(e) => handleChange(e)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} color="primary">Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}