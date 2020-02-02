import {
  AUTHENTICATE,
  CREATE_PROFILE,
  SET_PROFILES,
  LOGOUT
} from '../actions/auth';
import Profile from '../../models/profile';

const initialState = {
  token: null,
  userId: null,
  allProfiles: [],
  userProfile: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId
      };
    case SET_PROFILES:
      return {
        allProfiles: action.profiles,
        userProfile: action.userProfile
      };
    case CREATE_PROFILE:
      const newProfile = new Profile(
        action.profileData.id,
        action.profileData.name,
        action.profileData.phone,
        action.profileData.email
      );
      return {
        ...state,
        allProfiles: state.allProfiles.concat(newProfile)
      };

    case LOGOUT:
      return initialState;
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId
    //   };
    default:
      return state;
  }
};
