import React, { useEffect, useState, useCallback } from 'react';
import { getClient, Client } from '../../lib/client'; // eslint-disable-line
import { useAuthentication } from '../Auth/AuthContextProxyProvider';

import { createContext, useContext } from 'react';

import { TaskList } from '../../lib/types'; // eslint-disable-line

export interface ClientState {
  isInitialized: boolean; // whether we have initialized a client
  isLoggedIn: boolean; // mirrors isAuthenticated from auth0
  client?: Client;
  accessToken?: string;
  error?: Error;
  taskLists?: TaskList[];
  activeList?: TaskList;
}

export interface ApiClientContextInterface extends ClientState {
  switchActiveList: (taskList: TaskList) => Promise<void>;
  refreshTaskLists: () => Promise<void>;
}

/**
 * @ignore
 */
const stub = (): never => {
  throw new Error('You forgot to wrap your component in <ApiClientProvider>.');
};

/**
 * default state
 */
export const initialClientState: ClientState = {
  isInitialized: false,
  isLoggedIn: false,
};

/**
 * @ignore
 * default state
 */
const initialContext = {
  ...initialClientState,
  switchActiveList: stub,
  refreshTaskLists: stub,
};

/**
 * The Auth0 Context
 */
export const ApiClientContext = createContext<ApiClientContextInterface>(initialContext);

export const useApiClient = (): ApiClientContextInterface => useContext(ApiClientContext);

export interface ApiClientProviderOptions {
  /**
   * The child nodes your Provider has wrapped
   */
  children?: React.ReactNode;
}

/**
 * Provides the ApiClientContext to its child components.
 */
const ApiClientProvider = (opts: ApiClientProviderOptions): JSX.Element => {
  const {children} = opts;
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuthentication();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [apiClient, setApiClient] = useState<Client>(null);
  const [taskLists, setTaskLists] = useState(null);
  const [activeList, setActiveList] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    (async (): Promise<void> => {
      if (isAuthenticated && !isLoading && !isInitialized) {
        try {
          const token = await getAccessTokenSilently();
          const client = getClient(token);
          setApiClient(client);
          setAccessToken(token);
          try {
            const lists = await client.getTaskListsForUser();
            setIsInitialized(true);
            setIsLoggedIn(true);
            setTaskLists(lists);
            setActiveList(lists[0]);
          } catch (error) {
            setError(error);
          }
        } catch (error) {
          setError(error);
        }
      }
    })();
  }, [isAuthenticated, isLoading, isInitialized, getAccessTokenSilently]);

  const switchActiveList = useCallback(
    (taskList: TaskList): Promise<void> => {
      setActiveList(taskList);
      return;
    },
    []
  );

  const refreshTaskLists = useCallback(
    async (): Promise<void> => {
      const lists = await apiClient.getTaskListsForUser();
      setTaskLists(lists);
      
      if (lists.length === 0) {
        // no task lists remained for user
        setActiveList(null);
      }

      // previous active list might have been updated or removed
      const updatedList = lists.find(taskList => taskList.id === activeList?.id);
      if (updatedList) {
        setActiveList(updatedList);
      } else {
        setActiveList(lists[0]);
      }
    },
    [apiClient, activeList]
  );

  return (
    <ApiClientContext.Provider
      value={{
        isInitialized,
        isLoggedIn,
        client: apiClient,
        accessToken,
        error,
        taskLists,
        activeList,
        switchActiveList,
        refreshTaskLists,
      }}
    >
      {children}
    </ApiClientContext.Provider>
  );
};

export default ApiClientProvider;
