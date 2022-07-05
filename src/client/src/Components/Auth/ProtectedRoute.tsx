import React, { ComponentType, FC } from "react"; // eslint-disable-line
import { Route } from "react-router-dom";
import { useApiClient } from "../API/ApiClientProvider";

const withApiClientRequired = <P extends object>(Component: ComponentType<P>): FC<P> => (
  props: P
): JSX.Element => {
  const { isLoggedIn } = useApiClient();
  return isLoggedIn ? <Component {...props} /> : <></>;
};

const ProtectedRoute = ({ component, ...args }) => {
  return <Route component={withApiClientRequired(component)} {...args} />;
};

export default ProtectedRoute;
