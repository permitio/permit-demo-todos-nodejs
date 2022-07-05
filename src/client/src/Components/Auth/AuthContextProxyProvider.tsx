import React, { useState, useContext, useEffect } from "react";
import config from '../../config';
import { Auth0ContextInterface, useAuth0 } from "@auth0/auth0-react"; // eslint-disable-line
import { getClient } from '../../lib/client'; // eslint-disable-line
import _ from 'lodash'

async function getAccessToken(): Promise<string> {
  const client = getClient();
  return await client.login("notreal@gmail.com");
}

const AuthState: Partial<Auth0ContextInterface> = {
  user: {},
  isLoading: true,
  isAuthenticated: false,
  getAccessTokenSilently: getAccessToken,
  logout: () => {},
};

export const AuthenticationContext = React.createContext(AuthState);
export const useAuthentication = () => useContext(AuthenticationContext);

// A context that acts as a proxy to other auth context providers - targeting the rigth one according to config
const AuthContextProxyProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const auth0 = useAuth0();
  useEffect(() => {
    // If we use Auth0 sync value to its internal context
    if (config.authentication.provider === "auth0") {
      setAuth(auth0);
    } else {
      setAuth(_.assign(AuthState, {isLoading:false, isAuthenticated:true}));
    }
  }, [auth0, setAuth]);

  return <AuthenticationContext.Provider value={auth}>{children}</AuthenticationContext.Provider>;
};

export default AuthContextProxyProvider;
