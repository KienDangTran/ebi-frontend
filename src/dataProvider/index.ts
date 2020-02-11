import restDataProvider from './rest';

export const API_URL = 'http://localhost:8080';

export default (userSettings?: object, additionalDataProvider?: any) => {
  return restDataProvider(API_URL, userSettings, additionalDataProvider);
};
