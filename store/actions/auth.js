import { AsyncStorage } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCW5ea8PRTs-rgzfCE1Wd6vM0c56Elyy4g', //Key comes from firebase/project overview/project settings
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Något gick snett';
      if (errorId === 'EMAIL_EXISTS') {
        //check original error data for which error it threw
        message = 'Det finns redan en användare med den här mailen'; //set custom error message to describe the error
      }
      if (errorId === 'OPERATION_NOT_ALLOWED') {
        message = 'Lösenordslogin är avstängt för det här projektet';
      }
      if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message =
          'För många requests på en gång. Prova starta om och låt sidan ladda färdigt innan du försöker igen.';
      }
      throw new Error(message); //Pass the error with the custom message back, to be accessed in the ui
    }

    const resData = await response.json();

    console.log('Data from AUTHENTICATE: ', resData);

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

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCW5ea8PRTs-rgzfCE1Wd6vM0c56Elyy4g',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Något gick snett';
      if (errorId === 'EMAIL_NOT_FOUND') {
        //check original error data for which error it threw
        message = 'Mailen finns inte, typo? Försök igen.'; //set custom error message to describe the error
      }
      if (errorId === 'INVALID_PASSWORD') {
        message = 'Ogiltigt lösenord, försök igen.';
      }
      if (errorId === 'USER_DISABLED') {
        message = 'Användaren har blivit avstängd. Ojojoj.';
      }
      throw new Error(message); //Pass the error with the custom message back, to be accessed in the ui
    }

    const resData = await response.json();
    console.log(resData);
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
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
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
      expiryDate: expirationDate.toISOString()
    })
  );
};
