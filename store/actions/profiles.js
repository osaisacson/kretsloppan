import Profile from '../../models/profile';
import { convertImage } from '../helpers';

export const SET_PROFILES = 'SET_PROFILES';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const fetchProfiles = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://egnahemsfabriken.firebaseio.com/profiles.json');

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        const message = errorId;
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
            resData[key].profileDescription,
            resData[key].email,
            resData[key].phone,
            resData[key].address,
            resData[key].defaultPickupDetails,
            resData[key].image,
            resData[key].expoTokens
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

export function createProfile(
  profileName,
  profileDescription,
  email,
  phone,
  address,
  defaultPickupDetails,
  image
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      const convertedImage = await dispatch(convertImage(image));
      const profileData = {
        profileId: userId, //Set profileId to be the userId of the logged in user: we get this from auth
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
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/profiles.json?auth=${token}`,
        {
          method: 'POST',
          body: JSON.stringify(profileData),
        }
      );
      const returnedProfileData = await response.json();

      console.log('...profile created:', returnedProfileData);

      dispatch({
        type: CREATE_PROFILE,
        profileData: {
          firebaseId: returnedProfileData.name,
          profileId: userId,
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
  profileDescription,
  email,
  phone,
  address,
  defaultPickupDetails,
  image
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    try {
      let dataToUpdate = {
        profileName,
        profileDescription,
        email,
        phone,
        address,
        defaultPickupDetails,
        image,
      };

      console.log('Attempting to update profile...', dataToUpdate);

      if (image.length > 1000) {
        const convertedImage = await dispatch(convertImage(image));

        dataToUpdate = {
          profileName,
          profileDescription,
          email,
          phone,
          address,
          defaultPickupDetails,
          image: convertedImage.image,
        };
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

      console.log('...updated profile: ', returnedProfileData);

      dispatch({
        type: UPDATE_PROFILE,
        currUser: userId,
        fid: firebaseId,
        profileData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/profiles/updateProfile', error);
      throw error;
    }
  };
}
