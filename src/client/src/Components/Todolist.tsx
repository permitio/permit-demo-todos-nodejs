import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import { grey } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/CheckBox';
import UncheckedIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MoreIcon from '@material-ui/icons/MoreHoriz';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { usePageVisibility } from 'react-page-visibility';
import { useApiClient } from './API/ApiClientProvider';
import YesNoDialog from './Common/YesNoDialog';
import ShareDialog from './ShareDialog';
import AddListDialog from './Tasks/AddListDialog';
import RenameListDialog from './Tasks/RenameListDialog';
import TaskListSelector from './Tasks/TaskListSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > .ItemPaper': {
      margin: 8,
    },
    maxHeight: 'calc(100vh - 300px)',
    marginTop: 10,
    overflow: 'auto',
  },

}));

const POLLING_RATE = 2000;

export default function Todolist({ tasks }) {
  const classes = useStyles();
  const anchorRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { client, activeList, switchActiveList, taskLists, refreshTaskLists } = useApiClient();
  const [list, setList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const isVisible = usePageVisibility();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isYesNoDialogOpen, setIsYesNoDialogOpen] = useState(false);

  const [value, setValue] = useState('');
  const [editedValue, setEditedValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (activeList !== null && activeList !== undefined) {
      updateAllTasks(activeList.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList]);

  useEffect(() => {
    const pollingTask = setInterval(function () {
      if (isVisible && activeList !== null && activeList !== undefined) {
        updateAllTasks(activeList?.id);
      } else {
      }
    }, POLLING_RATE);
    return () => clearInterval(pollingTask);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Must be always called otherwise isVisible won't get updated in the scope
    // https://stackoverflow.com/questions/53024496/state-not-updating-when-using-react-state-hook-within-setinterval
  });

  const showError = (error, action=undefined) => {
  enqueueSnackbar(<span><Typography variant="subtitle1"> {action? `Failed to ${action}` : "Error"} </Typography> <Typography variant="caption">{error?.response?.data?.detail || error.message} </Typography> </span>, {
      variant: 'error',
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value !== '') {
      client
        .createTask(activeList?.id, value, '')
        .then(() => {
          updateAllTasks(activeList?.id);
          setValue('');
        })
        .catch((error) => showError(error, "create task"));
    }
  };

  const handleKeyDownEdited = (e, task) => {
    if (e.key === 'Enter' && editedValue !== '') {
      handleFinishEditing(task);
    }
  };
  const handleFinishEditing = (task) => {
    client
      .updateTask(activeList?.id, editingId, { ...task, title: editedValue })
      .then(() => {
        updateAllTasks(activeList?.id);
        setEditedValue('');
        setEditingId(null);
      })
      .catch((error) => showError(error, "update task"));
  };

  const handleDelete = (task) => {
    client
      .deleteTask(activeList?.id, task.id)
      .then(() => {
        updateAllTasks(activeList?.id);
      })
      .catch((error) => showError(error));
  };

  const toggleCheck = (task) => {
    const update = { ...task, checked: !task.checked };
    client
      .updateTask(activeList?.id, task.id, update)
      .then(() => {
        updateAllTasks(activeList?.id);
      })
      .catch((error) => showError(error, "update task"));
  };

  function updateAllTasks(listId: number) {
    client
      .getTasks(listId)
      .then((res) => {
        setList(res);
      })
      .catch((error) => showError(error));
  }

  const handleListAdd = async (title: string) => {
    client
      .addTaskList(title)
      .then(async (newList) => {
        await refreshTaskLists();
        switchActiveList(newList);
      })
      .catch((error) => showError(error, "create new list"));
  };

  function handleListRename(newTitle: string) {
    client
      .renameTaskList(activeList?.id, newTitle)
      .then(() => {
        refreshTaskLists();
      })
      .catch((error) => showError(error, "rename list"));
  }

  function handleListDelete() {
    client
      .deleteTaskList(activeList?.id)
      .then(() => {
        refreshTaskLists();
      })
      .catch((error) => showError(error, "delete task"));
  }

  const listView = _.sortBy(
    filter === 'all'
      ? list
      : filter === 'checked'
      ? _.filter(list, 'checked')
      : _.reject(list, 'checked'), "id");

  return (
    <div>
      <div
        style={{
          padding: 4,
          marginTop: -60,
          marginBottom: 25,
          marginLeft: 25,
          marginRight: 10,
          backgroundColor: 'transparent',
        }}
      >
        <Grid container style={{ marginBottom: 10, marginTop: 5 }}>
          <Grid item xs={2} md={4}></Grid>
          <Grid item xs={3} md={3}>
            <Container style={{ display: 'block', textAlign: 'center' }}>
              <TaskListSelector taskLists={taskLists} />
            </Container>
          </Grid>
          <Grid item xs={2} md={3} />

          <Grid item xs={3} md={1}>
            <ButtonGroup>
              <Button
                variant='contained'
                onClick={() => setIsMenuOpen(true)}
                ref={anchorRef}
                size='small'
              >
                <MoreIcon />
              </Button>

              {/* <Button
                size='small'
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsDialogOpen(true);
                }}
                variant='contained'
              >
                <ShareIcon />
              </Button> */}
            </ButtonGroup>

            <Menu
              id='simple-menu'
              anchorEl={anchorRef.current}
              getContentAnchorEl={null}
              keepMounted
              anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
              open={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            >
              <MenuItem onClick={() => setIsAddDialogOpen(true)}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary='New List' />
              </MenuItem>
              <MenuItem onClick={() => setIsRenameDialogOpen(true)}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary='Rename List' />
              </MenuItem>
              <MenuItem onClick={() => setIsYesNoDialogOpen(true)}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Delete List' />
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={1} md={1} />
        </Grid>
      </div>
      {(activeList !== null && activeList !== undefined) && (
        <div>
          <Paper>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText>
                <TextField
                  fullWidth
                  variant='outlined'
                  onKeyDown={handleKeyDown}
                  value={value}
                  label='New Task'
                  onChange={(e) => setValue(e.target.value)}
                ></TextField>
              </ListItemText>
            </ListItem>
          </Paper>
          <List className={classes.root}>
            {_.map(listView, (task) => (
              <Paper key={task.id} className='ItemPaper' style={{backgroundColor:"rgb(255 255 255 / 90%)"}}>
                <ListItem button>
                  <ListItemAvatar>
                    <IconButton onClick={() => toggleCheck(task)}>
                      {task.checked ? <CheckIcon /> : <UncheckedIcon />}
                    </IconButton>
                  </ListItemAvatar>
                  {editingId === task.id ? (
                    <ListItemText>
                      <TextField
                        style={{ width: 'calc(100% - 20px)' }}
                        size='small'
                        variant='outlined'
                        onKeyDown={(e) => handleKeyDownEdited(e, task)}
                        value={editedValue}
                        label='Task'
                        onChange={(e) => setEditedValue(e.target.value)}
                      ></TextField>
                    </ListItemText>
                  ) : (
                    <ListItemText
                      style={task.checked ? { textDecoration: 'line-through', color: grey[600] } : {}}
                      primaryTypographyProps={{
                        onClick: () => {
                          setEditingId(task.id);
                          setEditedValue(task.title);
                        },
                      }}
                      /*secondaryTypographyProps={{onClick:()=>{setEditingDescId(task.id);  setEditedDesc(task.description)}}}*/
                      primary={task.title}
                      secondary={task.description}
                    />
                  )}
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleDelete(task)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
          <Grid container spacing={4} style={{ marginBottom: 10, marginTop: 5 }}>
            <Grid item md={2} xs={4}>
              <Paper elevation={5} style={{ textAlign: 'center' }}>
                <FormControl>
                  <Select
                    labelId='filter-label'
                    label='Filter'
                    value={filter}
                    style={{ padding: 1, marginBottom: 3, minWidth: 60 }}
                    onChange={(e) => setFilter(e.target.value as string)}
                  >
                    <MenuItem value={'all'}>Show All</MenuItem>
                    <MenuItem value={'uncheked'}>
                      Show <UncheckedIcon></UncheckedIcon>{' '}
                    </MenuItem>
                    <MenuItem value={'checked'}>
                      Show <CheckIcon></CheckIcon>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item md={2} xs={4}>
              <Paper elevation={5}>
                <Typography style={{ textAlign: 'center', padding: 8 }} variant='subtitle2'>
                  Tasks: {_.filter(list, 'checked').length}/{list.length}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
      {(activeList === null || activeList === undefined) && (
        <Paper>
          <Grid container justify="center" alignItems="center" style={{ minHeight: "130px" }}>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography variant="h6">It looks like you have no lists yet...</Typography>
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button variant="contained" color="default" onClick={() => setIsAddDialogOpen(true)}>Create your first list</Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <AddListDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={(title) => handleListAdd(title)}
      />
      <RenameListDialog
        open={isRenameDialogOpen}
        initialName={activeList?.title}
        onClose={() => setIsRenameDialogOpen(false)}
        onSave={(newTitle) => handleListRename(newTitle)}
      />
      <YesNoDialog
        open={isYesNoDialogOpen}
        title={`Delete the list '${activeList?.title}'?`}
        question={'Deleting this list will also delete all todos inside. Are you sure?'}
        onClose={() => setIsYesNoDialogOpen(false)}
        onConfirm={() => handleListDelete()}
        cancelLabel='Cancel'
        confirmLabel='Delete List'
      />
      <ShareDialog
        listId={activeList?.id}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      ></ShareDialog>
    </div>
  );
}
