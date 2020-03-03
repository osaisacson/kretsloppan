import Profile from '../../models/profile';

import {
  SET_PROFILES,
  CREATE_PROFILE,
  UPDATE_PROFILE
} from '../actions/profiles';

const initialState = {
  allProfiles: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILES:
      return {
        allProfiles: action.allProfiles
      };
    case CREATE_PROFILE:
      const newProfile = new Profile(
        action.profileData.profileId,
        action.profileData.profileName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.image
      );
      return {
        ...state,
        allProfiles: state.allProfiles.concat(newProfile)
      };

    case UPDATE_PROFILE:
      const userId = getState().auth.userId; //Get the id of the currently logged in user
      const profileIndex = state.allProfiles.findIndex(
        profile => profile.profileId === userId //Find the index of the profile where the profileId is the same as the logged in userId
      );
      const updatedProfile = new Profile(
        action.profileData.profileId,
        action.profileData.profileName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.image
      );

      const updatedProfiles = [...state.allProfiles];
      updatedProfiles[profileIndex] = updatedProfile;

      return {
        ...state,
        allProfiles: updatedProfiles
      };
    default:
      return state;
  }
};
