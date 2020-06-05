import firebase from 'firebase';
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

const userCredentialsToJson = (credentials) => credentials.user.toJSON();

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
      const authData = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentialsToJson);

      const uid = authData.uid;
      const accessToken = authData.stsTokenManager.accessToken;
      const expirationTime = authData.stsTokenManager.expirationTime;

      await dispatch(authenticate(uid, accessToken, expirationTime));
      saveDataToStorage(accessToken, uid, expirationTime);
      updateExpoTokens(uid);

      console.log('store/actions/auth: attempting to create a profile with this data:', authData);
      // console.log('profileName: ', profileName);
      // console.log('profileDescription: ', profileDescription);
      // console.log('email: ', email);
      // console.log('phone: ', phone);
      // console.log('address: ', address);
      // console.log('defaultPickupDetails: ', defaultPickupDetails);
      // console.log('image.length: ', image.length);

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
      let message = error.message;

      switch (message) {
        case 'EMAIL_EXISTS':
          alert('Den här emailen finns redan');
          message = 'Den här emailen finns redan';
          break;
        case 'INVALID_EMAIL':
          message = 'Det verkar som emailen inte är en riktig email, prova igen';
          break;
        case 'MISSING_PASSWORD':
          message = 'Du verkar inte ha skrivit in något lösenord.';
          break;
        default:
      }
      alert(message);
      console.log(error);
      console.log('Error in store/actions/auth: ', error);
      return (process.exitCode = 1);
      // Rethrow so returned Promise is rejected
    }
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const authData = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredentialsToJson);

      const uid = authData.uid;
      const accessToken = authData.stsTokenManager.accessToken;
      const expirationTime = authData.stsTokenManager.expirationTime;

      dispatch(authenticate(uid, accessToken, expirationTime));
      saveDataToStorage(accessToken, uid, expirationTime);
      updateExpoTokens(uid);
    } catch (error) {
      let message = error.message;
      switch (message) {
        case 'EMAIL_NOT_FOUND':
          message =
            'Emailen kan inte hittas. Byt till att skapa konto om du aldrig loggat in innan, annars kolla stavningen.';
          break;
        case 'INVALID_EMAIL':
          message = 'Det verkar som emailen inte är en riktig email, prova igen';
          break;
        case 'INVALID_PASSWORD':
          message = 'Lösenordet passar inte emailen, prova igen';
          break;
        case 'MISSING_PASSWORD':
          message = 'Du verkar inte ha skrivit in något lösenord.';
          break;
        default:
      }

      alert(message);
      console.log(error);
      return (process.exitCode = 1);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await firebase.auth().signOut();
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
        expiryDate: String(expirationDate),
      })
    );
  } catch (error) {
    console.log('Error in store/actions/auth/saveDataToStorage: ', error);
    throw error;
  }
};
