import firebase from 'firebase';
import { AsyncStorage } from 'react-native';

import Profile from '../../models/profile';
import { convertImage } from '../helpers';

export const SET_PROFILES = 'SET_PROFILES';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_WALKTHROUGH = 'UPDATE_WALKTHROUGH';
export const UPDATE_READNEWS = 'UPDATE_READNEWS';
export const SET_CURRENT_PROFILE = 'SET_CURRENT_PROFILE';

export function setCurrentProfile(profile) {
  return {
    type: SET_CURRENT_PROFILE,
    payload: profile,
  };
}

export function fetchProfiles() {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log('Fetching profiles...');
      const profilesSnapshot = await firebase.database().ref('profiles').once('value');

      if (profilesSnapshot.exists) {
        const normalizedProfileData = profilesSnapshot.val();
        const allProfiles = [];
        let userProfile = {};

        for (const key in normalizedProfileData) {
          const profile = normalizedProfileData[key];
          const newProfile = new Profile(
            key,
            profile.profileId,
            profile.profileName,
            profile.profileDescription,
            profile.email,
            profile.phone,
            profile.address,
            profile.defaultPickupDetails,
            profile.image,
            profile.hasWalkedThrough,
            profile.hasReadNews,
            profile.expoTokens
          );

          allProfiles.push(newProfile);

          if (profile.profileId === uid) {
            userProfile = newProfile;
          }
        }

        dispatch({
          type: SET_PROFILES,
          allProfiles,
          userProfile,
          hasWalkedThrough: userProfile.hasWalkedThrough,
        });
        console.log(`Profiles:`);
        console.log(`...${allProfiles.length} total profiles found and loaded.`);
        if (userProfile) {
          console.log(`...profile for ${userProfile.profileName} found and loaded`);
        } else {
          console.log(
            `*****************************************************PROBLEM***************************************** userProfile is not loaded. uid is: ${uid}.`
          );
        }
      }
    } catch (error) {
      console.log('Error in actions/projects/fetchProfiles: ', error);
      throw error;
    }
  };
}

export function createProfile(
  profileName,
  profileDescription = '',
  email = '',
  phone = '',
  address = '',
  defaultPickupDetails = '',
  image
) {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      const convertedImage = await dispatch(convertImage(image));
      const profileData = {
        profileId: uid, //Set profileId to be the userId of the logged in user: we get this from auth
        profileName,
        profileDescription,
        email,
        phone,
        address,
        defaultPickupDetails,
        image: convertedImage.image, //This is how we link to the image we store above
      };

      console.log('Attempting to create a profile...');
      // Perform the API call - create the profile, passing the profileData object above
      const profileRef = await firebase.database().ref('profiles').push(profileData);

      console.log('...profile created:', profileRef);

      dispatch({
        type: CREATE_PROFILE,
        profileData: {
          firebaseId: profileRef.key,
          profileId: uid,
          profileName,
          profileDescription,
          email,
          phone,
          address,
          defaultPickupDetails,
          image: convertedImage.image,
        },
      });
    } catch (error) {
      console.log('Error in actions/profiles/createProfile', error);
      throw error;
    }
  };
}

export function updateProfile(
  firebaseId,
  profileName,
  profileDescription = '',
  email = '',
  phone = '',
  address = '',
  defaultPickupDetails = '',
  image
) {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log(`Attempting to update profile with id: ${firebaseId}...`);

      let dataToUpdate = {
        profileName,
        profileDescription,
        email,
        phone,
        address,
        defaultPickupDetails,
        image,
      };

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        const convertedImage = await dispatch(convertImage(image));
        dataToUpdate = {
          profileName,
          profileDescription,
          email,
          phone,
          address,
          defaultPickupDetails,
          image: convertedImage.image, //This is how we link to the image we store above
        };
      }

      const returnedProfileData = await firebase
        .database()
        .ref(`profiles/${firebaseId}`)
        .update(dataToUpdate);

      console.log(`...updated profile with id ${firebaseId}:`, returnedProfileData);

      dispatch({
        type: UPDATE_PROFILE,
        currUser: uid,
        fid: firebaseId,
        profileData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/profiles/updateProfile: ', error);
      throw error;
    }
  };
}

export function updateWalkthrough(firebaseId) {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log(
        `Attempting to set hasWalkedThrough to true for profile with firebase id of: ${firebaseId}...`
      );

      var dataToUpdate = {
        hasWalkedThrough: true,
      };

      const returnedProfileData = await firebase
        .database()
        .ref(`profiles/${firebaseId}`)
        .update(dataToUpdate);

      console.log(`...updated profile with id ${firebaseId}:`, returnedProfileData);

      dispatch({
        type: UPDATE_WALKTHROUGH,
        currUser: uid,
        fid: firebaseId,
        hasWalkedThrough: true,
      });
    } catch (error) {
      console.log('Error in actions/profiles/updateWalkthrough: ', error);
      throw error;
    }
  };
}

export function updateReadNews(firebaseId) {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log(`Attempting to set hasReadNews to true for profile with id of: ${firebaseId}...`);

      var dataToUpdate = {
        hasReadNews: true,
      };

      const returnedProfileData = await firebase
        .database()
        .ref(`profiles/${firebaseId}`)
        .update(dataToUpdate, function (error) {
          if (error) {
            console.log('Error when trying to update updateReadNews to true', error);
          } else {
            console.log('Updated updateReadNews to true!');
          }
        });

      console.log(`...updated profile with id ${firebaseId}:`, returnedProfileData);

      dispatch({
        type: UPDATE_READNEWS,
        currUser: uid,
        fid: firebaseId,
        profileData: { hasReadNews: true },
      });
    } catch (error) {
      console.log('Error in actions/profiles/updateReadNews: ', error);
      throw error;
    }
  };
}
