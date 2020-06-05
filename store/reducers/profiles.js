import Profile from '../../models/profile';
import { SET_PROFILES, CREATE_PROFILE, UPDATE_PROFILE } from '../actions/profiles';

const initialState = {
  allProfiles: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILES:
      return {
        allProfiles: action.allProfiles,
      };
    case CREATE_PROFILE: {
      const newProfile = new Profile(
        action.profileData.firebaseId,
        action.profileData.profileId,
        action.profileData.profileName,
        action.profileData.profileDescription,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.address,
        action.profileData.defaultPickupDetails,
        action.profileData.image
      );

      return {
        ...state,
        allProfiles: state.allProfiles.concat(newProfile),
      };
    }

    case UPDATE_PROFILE: {
      const profileIndex = state.allProfiles.findIndex(
        (profile) => profile.profileId === action.currUser //Find the index of the profile where the profileId is the same as the currently logged in userId
      );
      const updatedProfile = new Profile(
        action.fid, //the id of the profile in firebase
        state.allProfiles[profileIndex].profileId, //prev state profileId (ie, don't update this)
        action.profileData.profileName,
        action.profileData.profileDescription,
        action.profileData.email,
        action.profileData.phone,
        action.profileData.address,
        action.profileData.defaultPickupDetails,
        action.profileData.image,
        action.profileData.expoTokens
      );
      console.log('store/reducers/profiles/UPDATE_PROFILE, updated profile: ', updatedProfile);
      const updatedProfiles = [...state.allProfiles];
      updatedProfiles[profileIndex] = updatedProfile;

      return {
        ...state,
        allProfiles: updatedProfiles,
      };
    }
    default:
      return state;
  }
};
