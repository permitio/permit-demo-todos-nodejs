import React from "react";
import Button from "@material-ui/core/Button";
import { useAuthentication } from './AuthContextProxyProvider';

const LogoutButton = () => {
  const { logout } = useAuthentication();

  return (
    <Button 
      color='inherit'
      onClick={() => logout({ returnTo: window.location.origin })}>Log Out</Button>
  );
};

export default LogoutButton;