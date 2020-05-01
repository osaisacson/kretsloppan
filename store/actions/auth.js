import { AsyncStorage, Alert } from 'react-native';
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
    try {
      return fetch(
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
      )
        .then((response) => response.json())

        .then((resData) => {
          if (!resData.ok) {
            const errorId = resData.error.message;
            //TODO: More customised error messages by errorId
            if (errorId === 'EMAIL_EXISTS') {
              alert('Den här emailen finns redan');
              throw new Error(errorId);
            }

            alert(errorId);
            throw new Error(errorId);
          }

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
            'store/actions/auth: attempting to create a profile with this data:'
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
      return fetch(
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
      )
        .then((response) => response.json())
        .then((resData) => {
          if (!resData.ok) {
            const errorId = resData.error.message;
            if (errorId === 'EMAIL_EXISTS') {
              alert('Den här emailen finns redan');
              throw new Error(errorId);
            }
            if (errorId === 'EMAIL_NOT_FOUND') {
              alert(
                'Emailen kan inte hittas. Byt till att skapa konto om du aldrig loggat in innan, annars kolla stavningen.'
              );
              throw new Error(errorId);
            }
            if (errorId === 'INVALID_PASSWORD') {
              alert('Lösenordet passar inte emailen, prova igen');
              throw new Error(errorId);
            }
            if (errorId === 'MISSING_PASSWORD') {
              alert('Du verkar inte ha skrivit in något lösenord');
              throw new Error(errorId);
            }
            Alert.alert('Något gick snett!', errorId, [{ text: 'OK' }]);
            throw new Error(errorId);
          }

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
        });
    } catch (error) {
      console.log('ERROR: ', error);
      // Rethrow so returned Promise is rejected
      throw error;
    }
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
