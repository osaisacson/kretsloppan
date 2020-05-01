import Profile from '../../models/profile';

export const LOADING = 'LOADING';
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
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export function createProfile(profileName, email, phone, address, image) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/profiles/createProfile--------');

      //First convert the base64 image to a firebase url...
      return dispatch(convertImage(image)).then(
        async (parsedRes) => {
          //...then take the returned image and...
          console.log(
            'returned result from the convertImage function: ',
            parsedRes
          );

          //...together with the rest of the data create the profileData object.
          const profileData = {
            profileId: userId, //Set profileId to be the userId of the logged in user: we get this from auth
            profileName,
            email,
            phone,
            address,
            image: parsedRes.image, //This is how we link to the image we store above
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
              image: parsedRes.image,
            },
          });
          console.log('----------actions/profiles/createProfile--------END');
          dispatch({ type: 'LOADING', loading: false });
        },
        (error) => {
          dispatch({ type: 'LOADING', loading: false });
          throw error;
        }
      );
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
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

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    try {
      console.log('START----------actions/profiles/updateProfile--------');

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        //First convert the base64 image to a firebase url...
        return dispatch(convertImage(image)).then(
          async (parsedRes) => {
            //...then take the returned image and...
            console.log(
              'returned result from the convertImage function: ',
              parsedRes
            );

            const dataToUpdate = {
              profileName,
              email,
              phone,
              address,
              image: parsedRes.image,
            };

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
            dispatch({ type: 'LOADING', loading: false });
          },
          (error) => {
            dispatch({ type: 'LOADING', loading: false });
            throw error;
          }
        );
      }

      //If we are NOT passing a base64 image, update with the old image and passed data
      const dataToUpdate = {
        profileName,
        email,
        phone,
        address,
        image,
      };

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
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/profiles/updateProfile--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}
