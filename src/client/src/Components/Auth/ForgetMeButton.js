import React from "react";
import Button from "@material-ui/core/Button";
import { useAuthentication } from './AuthContextProxyProvider';
import { useApiClient } from "../API/ApiClientProvider";
import { useSnackbar } from "notistack";
import { Typography } from "@material-ui/core";

const ForgetMeButton = () => {
  const { logout } = useAuthentication();
  const { client } = useApiClient();
  const { enqueueSnackbar } = useSnackbar();

  const showError = (error, action=undefined) => {
    enqueueSnackbar(
      <span>
        <Typography variant="subtitle1"> {action? `Failed to ${action}` : "Error"} </Typography>
        <Typography variant="caption">{error?.response?.data?.detail || error.message} </Typography>
      </span>, {
        variant: 'error',
      }
    );
  };

  const forgetMe = () => {
    client
      .forgetLoggedInUser()
      .then(() => {
        logout({ returnTo: window.location.origin });
      })
      .catch((error) => showError(error, "remove user"));
  };

  return (
    <Button 
      color='inherit'
      onClick={() => forgetMe()}>Remove user and logout</Button>
  );
};

export default ForgetMeButton;