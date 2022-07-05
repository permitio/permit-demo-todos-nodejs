import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'; // eslint-disable-line
import Toolbar from '@material-ui/core/Toolbar';
import { TransitionProps } from '@material-ui/core/transitions'; // eslint-disable-line
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import config from '../config';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function ShareDialog({ open, onClose, listId }) {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  const iframeUrl =
    config.authorization.embedUrl + `/user-management?displayMode=embedded&customTenantId=${listId}`;

  return (
    <div>
      <Dialog
        maxWidth='xl'
        fullWidth
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={handleClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
            <Typography variant='h6' className={classes.title}>
              Share List
            </Typography>
          </Toolbar>
        </AppBar>
        <iframe title='share' src={iframeUrl} style={{ border: 'none', minHeight: '60vh' }} />
      </Dialog>
    </div>
  );
}
