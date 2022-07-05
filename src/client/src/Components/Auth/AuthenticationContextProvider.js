import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import config from '../../config';
import AuthContextProxyProvider from "./AuthContextProxyProvider";

const AuthenticationContextProvider = ({ children }) => {
  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };
  switch (config.authentication.provider) {
    case "auth0":
      return (
        <Auth0Provider
          domain={config.auth0.domain}
          clientId={config.auth0.clientId}
          audience={config.auth0.audience}
          redirectUri={window.location.origin}
          onRedirectCallback={onRedirectCallback}
          // TODO: this is not recommended by auth0
          // see: https://github.com/acallasec/WebApp/issues/3
          cacheLocation={"localstorage"}
        >
          <AuthContextProxyProvider>{children}</AuthContextProxyProvider>
        </Auth0Provider>
      );
    case "simple":
    default:
      return <AuthContextProxyProvider>{children}</AuthContextProxyProvider>;
  }
};

export default AuthenticationContextProvider;
