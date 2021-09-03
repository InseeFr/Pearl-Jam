export const getMail = kc => (kc && kc.idTokenParsed && kc.idTokenParsed.email) || '';

export const getUserName = kc => (kc && kc.idTokenParsed && kc.idTokenParsed.name) || '';

export const getIdep = kc => (kc && kc.idTokenParsed && kc.idTokenParsed.preferred_username) || '';
