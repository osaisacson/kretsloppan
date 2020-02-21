import User from '../../models/user';

export const SET_USERS = 'SET_USERS';
export const CREATE_USER = 'CREATE_USER';
export const UPDATE_USER = 'UPDATE_USER';

export const fetchUsers = () => {
  return async dispatch => {
    const userId = getState().auth.userId;

    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/users.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadedUsers = [];

      for (const key in resData) {
        loadedUsers.push(
          new User(
            key,
            resData[key].email,
            resData[key].password,
            resData[key].userName
          )
        );
      }

      dispatch({
        type: SET_USERS,
        users: loadedUsers,
        currentUser: loadedUsers.filter(usr => usr.id === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const createUser = (email, password) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const tmpString = email.split('@');
    const formattedUsername = tmpString[0];

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/users.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userName: formattedUsername
        })
      }
    );

    const resData = await response.json();
    console.log('resData from createUser:', resData);

    dispatch({
      type: CREATE_USER,
      userData: {
        id: userId,
        email,
        password,
        userName
      }
    });
  };
};

export const updateUser = (email, password, userName) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/users/${userId}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          userName
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: UPDATE_USER,
      uid: userId,
      userData: {
        email,
        password,
        userName
      }
    });
  };
};
