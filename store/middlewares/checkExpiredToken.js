import { AsyncStorage } from 'react-native';

import { logout } from '../actions/auth';

const checkExpiredToken = (store) => (next) => async (action) => {
  const userData = await AsyncStorage.getItem('userData').then((data) =>
    data ? JSON.parse(data) : {}
  );

  if (userData) {
    const tokenExpiry = new Date(userData.expiryDate).getTime();
    const now = new Date().getTime();
    if (tokenExpiry <= now) {
      logout(next);
    }
  }

  return next(action);
};

export default checkExpiredToken;
