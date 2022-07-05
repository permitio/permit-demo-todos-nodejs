
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import React, { useState } from "react";
import JdenticonAvatar from "./JdenticonAvatar";
import { useAuthentication } from './AuthContextProxyProvider';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import ForgetMeButton from "./ForgetMeButton";

const AuthenticationButton = () => {
  const { user, isAuthenticated } = useAuthentication();
  const anchorRef = React.useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <React.Fragment>
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && (
        <div>
          <IconButton
            ref={anchorRef}
            color="inherit"
            onClick={() => {
              setIsMenuOpen(true);
            }}
          >
            <JdenticonAvatar
              seed={user.email}
              alt={user.email}
              src={user.picture}
            ></JdenticonAvatar>
          </IconButton>
          <Menu
            anchorEl={anchorRef.current}
            getContentAnchorEl={null}
            keepMounted
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
          >
            <MenuItem>{user.email}</MenuItem>
            <MenuItem>
              <ForgetMeButton />
            </MenuItem>
            <MenuItem>
              <LogoutButton />
            </MenuItem>
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
};

export default AuthenticationButton;
