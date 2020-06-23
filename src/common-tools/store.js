import React, { createContext, useReducer } from 'react';
import { InitAuth } from './auth/initAuth';

const initialState = {
  authenticated: InitAuth(),
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    let authResult = null;
    switch (action.type) {
      case 'initAuth':
        authResult = useAuth();
        return {
          ...state,
          authenticated: authResult.authenticated,
        };

      /* TODO gerer les retours d'event ici */

      default:
        return state;
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
