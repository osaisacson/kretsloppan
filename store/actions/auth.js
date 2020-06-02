import { AsyncStorage } from 'react-native';

import ENV from '../../env';
import { updateExpoTokens } from '../helpers';
import * as profilesActions from './profiles';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN = 'SET_DID_TRY_AUTO_LOGIN';

export const setDidTryAutoLogin = () => {
  return { type: SET_DID_TRY_AUTO_LOGIN };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, userId, token });
  };
};

export const signup = (
  email,
  password,
  profileName,
  profileDescription,
  phone,
  address,
  defaultPickupDetails,
  image
) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ENV.googleApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const resData = await response.json();

      if (resData.error) {
        const errorId = resData.error.message;
        let message = errorId;
        if (errorId === 'EMAIL_EXISTS') {
          alert('Den här emailen finns redan');
          message = 'Den här emailen finns redan';
        }
        if (errorId === 'INVALID_EMAIL') {
          message = 'Det verkar som emailen inte är en riktig email, prova igen';
        }
        if (errorId === 'MISSING_PASSWORD') {
          message = 'Du verkar inte ha skrivit in något lösenord.';
        }
        alert(message);
        console.log(resData.error);
        return (process.exitCode = 1);
      }
      updateExpoTokens(resData.localId);
      await dispatch(
        authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000)
      );
      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);

      console.log('store/actions/auth: attempting to create a profile with this data:');
      console.log('profileName: ', profileName);
      console.log('profileDescription: ', profileDescription);
      console.log('email: ', email);
      console.log('phone: ', phone);
      console.log('address: ', address);
      console.log('defaultPickupDetails: ', defaultPickupDetails);
      console.log('image.length: ', image.length);

      try {
        console.log('Attempting to create profile');
        dispatch(
          profilesActions.createProfile(
            profileName,
            profileDescription,
            email,
            phone,
            address,
            defaultPickupDetails,
            image
          )
        );
      } catch (err) {
        console.log(
          'store/actions/auth: Something went wrong when trying to create profile: ',
          err
        );
      }
      console.log('...created profile!');
    } catch (error) {
      console.log('Error in store/actions/auth: ', error);
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ENV.googleApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const resData = await response.json();

      if (resData.error) {
        const errorId = resData.error.message;
        let message = errorId;
        if (errorId === 'EMAIL_NOT_FOUND') {
          message =
            'Emailen kan inte hittas. Byt till att skapa konto om du aldrig loggat in innan, annars kolla stavningen.';
        }
        if (errorId === 'INVALID_EMAIL') {
          message = 'Det verkar som emailen inte är en riktig email, prova igen';
        }
        if (errorId === 'INVALID_PASSWORD') {
          message = 'Lösenordet passar inte emailen, prova igen';
        }
        if (errorId === 'MISSING_PASSWORD') {
          message = 'Du verkar inte ha skrivit in något lösenord.';
        }
        alert(message);
        console.log(resData.error);
        return (process.exitCode = 1);
      }

      const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);

      updateExpoTokens(resData.localId);
      dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000));
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      console.log('Error when trying to login: ', error);
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      const userData = await AsyncStorage.getItem('userData').then((data) =>
        data ? JSON.parse(data) : {}
      );
      updateExpoTokens(userData.userId, true);
      AsyncStorage.removeItem('userData'); //Remove data from our local storage
      dispatch({ type: LOGOUT });
    } catch (error) {
      console.log('Error in store/actions/auth/saveDataToStorage: ', error);
      throw error;
    }
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  try {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token,
        userId,
        expiryDate: expirationDate.toISOString(),
      })
    );
  } catch (error) {
    console.log('Error in store/actions/auth/saveDataToStorage: ', error);
    throw error;
  }
};
