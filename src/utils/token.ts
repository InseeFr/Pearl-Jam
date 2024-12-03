type KeycloackInformation = {
  idTokenParsed?: {
    email: string;
    name: string;
    preferred_username: string;
  };
};

export const getMail = (kc: KeycloackInformation) =>
  (kc && kc.idTokenParsed && kc.idTokenParsed.email) || '';

export const getUserName = (kc: KeycloackInformation) =>
  (kc && kc.idTokenParsed && kc.idTokenParsed.name) || '';

export const getIdep = (kc: KeycloackInformation) =>
  (kc && kc.idTokenParsed && kc.idTokenParsed.preferred_username) || '';
