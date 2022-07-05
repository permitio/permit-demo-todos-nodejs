import _ from 'lodash';
import React, { useState } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core';
import { TaskList } from '../../lib/types'; // eslint-disable-line
import { useApiClient } from '../API/ApiClientProvider';
import ArrowDownIcon from '@material-ui/icons/ArrowDropDown';

type Props = {
  taskLists: TaskList[];
}

export default function TaskListSelector(props: Props) {
  const [taskListAnchorEl, setTaskListAnchorEl] = useState(null);
  const { activeList, switchActiveList } = useApiClient();

  const handleOpenMenu = (event) => {
    setTaskListAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setTaskListAnchorEl(null);
  };

  const handleSwitchList = (selectedList: TaskList) => {
    handleCloseMenu();
    if (selectedList.id !== activeList.id) {
      switchActiveList(selectedList);
    }
  };

  return ((activeList !== null && activeList !== undefined) && (
    <>
      <Button variant="contained" size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleOpenMenu}>
        {activeList?.title} <ArrowDownIcon/>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={taskListAnchorEl}
        keepMounted
        open={Boolean(taskListAnchorEl)}
        onClose={handleCloseMenu}
      >
        {_.map(props.taskLists, (taskList) => (
          <MenuItem key={taskList.id.toString()} onClick={() => handleSwitchList(taskList)}>{taskList.title}</MenuItem>
        ))}
      </Menu>
    </>
  ));
}
