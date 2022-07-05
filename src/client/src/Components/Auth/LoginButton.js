import React from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <Button color='inherit' onClick={() => loginWithRedirect()}>Login</Button>;
};

export default LoginButton;