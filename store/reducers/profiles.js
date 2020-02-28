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
      console.log('action.allProfiles in reducers', action.allProfiles);

      return {
        allProfiles: action.allProfiles
      };
    case CREATE_PROFILE:
      const profileIndex = state.allProfiles.findIndex(
        profile => profile.profileId === action.profileId
      );

      const newProfile = new Profile(
        action.profileData.profileId,
        action.profileData.profileName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.image,
        action.profileData.date
      );
      return {
        ...state,
        allProfiles: state.allProfiles.concat(newProfile)
      };

    case UPDATE_PROFILE:
      const updatedProfile = new Profile(
        state.allProfiles[profileIndex].profileId,
        action.profileData.profileName,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.image,
        state.allProfiles[profileIndex].date
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
