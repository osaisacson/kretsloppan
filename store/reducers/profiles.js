import Profile from '../../models/profile';
import {
  SET_PROFILES,
  CREATE_PROFILE,
  UPDATE_PROFILE,
  UPDATE_WALKTHROUGH,
  UPDATE_READNEWS,
  SET_CURRENT_PROFILE,
} from '../actions/profiles';

const initialState = {
  allProfiles: [],
  userProfile: {},
  hasWalkedThrough: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILES:
      return {
        ...state,
        allProfiles: action.allProfiles,
        userProfile: action.userProfile,
        hasWalkedThrough: !!action.hasWalkedThrough,
      };

    case SET_CURRENT_PROFILE: {
      const userProfile = action.payload.uid
        ? state.allProfiles.find((profile) => profile.profileId === action.payload.uid)
        : {};

      return {
        ...state,
        userProfile,
      };
    }
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
        state.allProfiles[profileIndex].hasWalkedThrough,
        state.allProfiles[profileIndex].hasReadNews,
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
    case UPDATE_WALKTHROUGH: {
      return {
        ...state,
        allProfiles: state.allProfiles.map((profile) => {
          if (profile.profileId === action.currUser) {
            profile.hasWalkedThrough = true;
          }
          return profile;
        }),
        userProfile: {
          ...state.userProfile,
          hasWalkedThrough: true,
        },
      };
    }
    case UPDATE_READNEWS: {
      const profileIndex = state.allProfiles.findIndex(
        (profile) => profile.profileId === action.currUser //Find the index of the profile where the profileId is the same as the currently logged in userId
      );
      const updatedProfileReadNews = new Profile(
        action.fid, //the id of the profile in firebase
        state.allProfiles[profileIndex].profileId, //prev state profileId (ie, don't update this)
        state.allProfiles[profileIndex].profileName,
        state.allProfiles[profileIndex].profileDescription,
        state.allProfiles[profileIndex].email,
        state.allProfiles[profileIndex].phone,
        state.allProfiles[profileIndex].address,
        state.allProfiles[profileIndex].defaultPickupDetails,
        state.allProfiles[profileIndex].image,
        state.allProfiles[profileIndex].hasWalkedThrough,
        action.profileData.hasReadNews,
        state.allProfiles[profileIndex].expoTokens
      );
      console.log(
        'store/reducers/profiles/UPDATE_READNEWS, updated profile: ',
        updatedProfileReadNews
      );
      const updatedProfiles = [...state.allProfiles];
      updatedProfiles[profileIndex] = updatedProfileReadNews;

      return {
        ...state,
        allProfiles: updatedProfiles,
      };
    }
    default:
      return state;
  }
};
