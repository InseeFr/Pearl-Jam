/**
 * Get the configuration
 */
export const useConfiguration = () => {
  // TODO : dégager ça
  return {
    QUEEN_URL: import.meta.env.VITE_QUEEN_URL,
    PEARL_API_URL: import.meta.env.VITE_PEARL_API_URL,
    PEARL_AUTHENTICATION_MODE: import.meta.env.VITE_PEARL_AUTHENTICATION_MODE,
  };
};
