import Profile from '../../models/profile';

export const SET_PROFILES = 'SET_PROFILES';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

import { convertImage } from '../helpers';

export const fetchProfiles = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/profiles.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadedProfiles = [];

      for (const key in resData) {
        loadedProfiles.push(
          new Profile(
            key,
            resData[key].profileId,
            resData[key].profileName,
            resData[key].email,
            resData[key].phone,
            resData[key].address,
            resData[key].image
          )
        );
      }
      dispatch({
        type: SET_PROFILES,
        allProfiles: loadedProfiles,
      });
    } catch (error) {
      console.log(error);
      // send to custom analytics server
      throw error;
    }
  };
};

export function createProfile(profileName, email, phone, address, image) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      console.log('START----------actions/profiles/createProfile--------');

      const convertedImage = await dispatch(convertImage(image));
      const profileData = {
        profileId: userId, //Set profileId to be the userId of the logged in user: we get this from auth
        profileName,
        email,
        phone,
        address,
        image: convertedImage.image, //This is how we link to the image we store above
      };

      // Perform the API call - create the profile, passing the profileData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/profiles.json?auth=${token}`,
        {
          method: 'POST',
          body: JSON.stringify(profileData),
        }
      );
      const returnedProfileData = await response.json();

      console.log('dispatching CREATE_PROFILE');

      dispatch({
        type: CREATE_PROFILE,
        profileData: {
          firebaseId: returnedProfileData.name,
          profileId: userId,
          profileName,
          email,
          phone,
          address,
          image: convertedImage.image,
        },
      });
      console.log('----------actions/profiles/createProfile--------END');
    } catch (error) {
      console.log(error);
      ('----------actions/profiles/createProfile--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProfile(
  firebaseId,
  profileName,
  email,
  phone,
  address,
  image
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      console.log('START----------actions/profiles/updateProfile--------');

      let dataToUpdate = {
        profileName,
        email,
        phone,
        address,
        image,
      };

      if (image.length > 1000) {
        const convertedImage = await dispatch(convertImage(image));

        dataToUpdate = {
          profileName,
          email,
          phone,
          address,
          image: convertedImage.image,
        };

        console.log('----------actions/profiles/updateProfile--------END');
      }

      // Perform the API call - create the profile, passing the profileData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/profiles/${firebaseId}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpdate),
        }
      );
      const returnedProfileData = await response.json();

      console.log(
        'returnedProfileData from updating profile, after patch',
        returnedProfileData
      );

      console.log('dispatching UPDATE_PROFILE');

      dispatch({
        type: UPDATE_PROFILE,
        currUser: userId,
        fid: firebaseId,
        profileData: dataToUpdate,
      });

      console.log('----------actions/profiles/updateProfile--------END');
    } catch (error) {
      console.log(error);

      ('----------actions/profiles/updateProfile--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}
