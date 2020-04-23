import { AsyncStorage } from 'react-native';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AUTO_LOGIN = 'SET_DID_TRY_AUTO_LOGIN';
import * as profilesActions from './profiles';

import ENV from '../../env';

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

export const signup = (email, password, profileName, phone, address, image) => {
  return async (dispatch) => {
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

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      if (errorId === 'EMAIL_EXISTS') {
        message = 'Den här emailen finns redan';
      }
      //TODO: Customised error messages
      throw new Error(message);
    }

    await response
      .json()
      .then((resData) => {
        dispatch(
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
      })
      .then(() => {
        console.log(
          'store/actions/auth: trying to create a profile with this data:'
        );
        console.log('profileName: ', profileName);
        console.log('email: ', email);
        console.log('phone: ', phone);
        console.log('address: ', address);
        console.log('image.length: ', image.length);

        try {
          dispatch(
            profilesActions.createProfile(
              profileName,
              email,
              phone,
              address,
              image
            )
          );
        } catch (err) {
          console.log(
            'store/actions/auth: Something went wrong when trying to create profile'
          );
        }
        console.log('store/actions/auth: Success! Created profile');
      });
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
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

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      if (errorId === 'EMAIL_NOT_FOUND') {
        message =
          'Emailen kan inte hittas. Byt till att skapa konto om du aldrig loggat in innan, annars kolla stavningen.';
      }
      if (errorId === 'INVALID_PASSWORD') {
        message = 'Lösenordet passar inte emailen, prova igen';
      }
      if (errorId === 'MISSING_PASSWORD') {
        message = 'Du verkar inte ha skrivit in något lösenord.';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log('logged in user data: ', resData);
    dispatch(
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
  };
};

export const logout = () => {
  clearLogoutTimer();
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
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
