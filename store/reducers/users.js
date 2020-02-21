import User from '../../models/user';

import { SET_USERS, CREATE_USER, UPDATE_USER } from '../actions/users';

const initialState = {
  users: [],
  currentUser: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS:
      return {
        users: action.users,
        currentUser: action.currentUser
      };
    case CREATE_USER:
      const newUser = new User(
        action.userData.id,
        action.userData.email,
        action.userData.password,
        action.userData.userName
      );
      return {
        ...state,
        users: state.users.concat(newUser),
        currentUser: state.currentUser.concat(newUser)
      };
    case UPDATE_USER:
      const updatedUser = new User(
        action.uid,
        action.userData.email,
        action.userData.password,
        action.userData.userName
      );
      const userIndex = state.users.findIndex(usr => usr.id === action.uid);
      const updatedUsers = [...state.users];
      updatedUsers[userIndex] = updatedUser;
      const updatedCurrentUser = [...state.currentUser];
      updatedCurrentUser[userIndex] = updatedUser;
      return {
        ...state,
        users: updatedUsers,
        currentUser: updatedCurrentUser
      };
    default:
      return state;
  }
};
