type KeycloackInformation = {
  idTokenParsed?: {
    email: string;
    name: string;
    preferred_username: string;
  };
};

export const getMail = (kc: KeycloackInformation) => kc?.idTokenParsed?.email || '';

export const getUserName = (kc: KeycloackInformation) => kc?.idTokenParsed?.name || '';

export const getIdep = (kc: KeycloackInformation) => kc?.idTokenParsed?.preferred_username || '';
