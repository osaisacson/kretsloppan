import { AsyncStorage } from 'react-native';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN = 'SET_DID_TRY_AUTO_LOGIN';
import * as profilesActions from './profiles';
import * as firebase from 'firebase';

import ENV from '../../env';
import { updateExpoTokens } from '../helpers';

let timer;

export const setDidTryAutoLogin = () => {
  return { type: SET_DID_TRY_AUTO_LOGIN };
};

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (
  email,
  password,
  profileName,
  profileDescription,
  phone,
  address,
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
            email: email,
            password: password,
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
          message =
            'Det verkar som emailen inte är en riktig email, prova igen';
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
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);

      console.log(
        'store/actions/auth: attempting to create a profile with this data:'
      );
      console.log('profileName: ', profileName);
      console.log('profileDescription: ', profileDescription);
      console.log('email: ', email);
      console.log('phone: ', phone);
      console.log('address: ', address);
      console.log('image.length: ', image.length);

      try {
        dispatch(
          profilesActions.createProfile(
            profileName,
            profileDescription,
            email,
            phone,
            address,
            image
          )
        );
      } catch (err) {
        console.log(
          'store/actions/auth: Something went wrong when trying to create profile: ',
          err
        );
      }
      console.log('store/actions/auth: Success! Created profile');
    } catch (error) {
      console.log('ERROR: ', error);
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
            email: email,
            password: password,
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
          message =
            'Det verkar som emailen inte är en riktig email, prova igen';
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

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );

      updateExpoTokens(resData.localId);

      dispatch(
        authenticate(
          resData.localId,
          resData.idToken,
          parseInt(resData.expiresIn) * 1000
        )
      );

      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      console.log('Error when trying to login: ', error);

      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
};

export const logout = async () => {
  clearLogoutTimer();
  const userData = await AsyncStorage.getItem('userData').then((data) =>
    data ? JSON.parse(data) : {}
  );
  updateExpoTokens(userData.userId, true);
  AsyncStorage.removeItem('userData'); //Remove data from our local storage
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  try {
    AsyncStorage.setItem(
      'userData',
      JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),
      })
    );
  } catch (error) {
    console.log('ERROR: ', error);
    // Rethrow so returned Promise is rejected
    throw error;
  }
};
