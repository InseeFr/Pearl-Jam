import React, { createContext, useReducer } from 'react';
import { useAuth } from './auth/initAuth';

const initialState = {
  authenticated: false,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const auth = useAuth().authenticated;
  console.log(auth);
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'initAuth':
        return {
          ...state,
          authenticated: auth,
        };

      /* TODO gerer les retours d'event ici */

      default:
        return state;
    }
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
