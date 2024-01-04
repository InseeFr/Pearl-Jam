import React from 'react';

export const UserContext = React.createContext({
  title: 'MISTER',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.fr',
  phoneNumber: '+330000000000',
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
