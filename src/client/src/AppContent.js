import React from 'react';
import { Switch } from 'react-router-dom';
import { useAuthentication } from './Components/Auth/AuthContextProxyProvider';
import Loading from './Components/Common/Loading';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Todolist from './Components/Todolist';

export function AppContent() {

  const { isLoading } = useAuthentication();

  if (isLoading) {
    return (
      <Loading centered={true} />
    );
  }

  return (
    <Switch>
      <ProtectedRoute exact path="/" component={Todolist} />
    </Switch>
  );
}