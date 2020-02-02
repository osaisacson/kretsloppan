import {
  DELETE_PROFILE,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  SET_PROFILES
} from '../actions/profiles';
import Profile from '../../models/profile';

const initialState = {
  availableProfiles: [],
  userProfiles: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILES:
      return {
        availableProfiles: action.profiles,
        userProfiles: action.userProfiles
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
        availableProfiles: state.availableProfiles.concat(newProfile),
        userProfiles: state.userProfiles.concat(newProfile)
      };
    case UPDATE_PROFILE:
      const profileIndex = state.userProfiles.findIndex(
        prof => prof.id === action.id
      );
      const updatedProfile = new Profile(
        action.profileData.id,
        action.profileData.name,
        action.profileData.phone,
        action.profileData.email
      );
      const updatedUserProfiles = [...state.userProfiles];
      updatedUserProfiles[profileIndex] = updatedProfile;
      const availableProfileIndex = state.availableProfiles.findIndex(
        prof => prof.id === action.id
      );
      const updatedAvailableProfiles = [...state.availableProfiles];
      updatedAvailableProfiles[availableProfileIndex] = updatedProfile;
      return {
        ...state,
        availableProfiles: updatedAvailableProfiles,
        userProfiles: updatedUserProfiles
      };
    case DELETE_PROFILE:
      return {
        ...state,
        userProfiles: state.userProfiles.filter(
          profile => profile.id !== action.id
        ),
        availableProfiles: state.availableProfiles.filter(
          profile => profile.id !== action.id
        )
      };
  }
  return state;
};
