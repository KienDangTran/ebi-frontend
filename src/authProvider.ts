import { AuthProvider } from 'ra-core';

const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    localStorage.setItem('access_token', btoa(`${username}:${password}`));
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem('access_token');
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem('access_token') ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.reject('Unknown method')
};

export default authProvider;
