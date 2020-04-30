import Profile from '../../models/profile';

export const LOADING = 'LOADING';
export const SET_PROFILES = 'SET_PROFILES';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

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

      // console.log('allProfiles in actions', loadedProfiles);

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

//TODO: Create file with helperfunctions, move createImage there
export function createImage(image) {
  return async (dispatch) => {
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/profiles/createImage--------');
      console.log('Attempting to convert image from base64 to firebase url');
      console.log('image.length: ', image.length);

      // Perform the API call - convert image from base64 to a firebase url
      const response = await fetch(
        'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
        {
          method: 'POST',
          body: JSON.stringify({
            image: image, //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
          }),
        }
      );

      const firebaseImageUrl = await response.json();
      console.log('returned image url from firebase', firebaseImageUrl);
      console.log('----------actions/profiles/createImage--------END');
      return firebaseImageUrl;
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/profiles/updateReservedProfile--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function createProfile(profileName, email, phone, address, image) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/profiles/createProfile--------');

      //First convert the base64 image to a firebase url...
      return dispatch(createImage(image)).then(
        async (parsedRes) => {
          //...then take the returned image and...
          console.log(
            'returned result from the createImage function: ',
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
        return dispatch(createImage(image)).then(
          async (parsedRes) => {
            //...then take the returned image and...
            console.log(
              'returned result from the createImage function: ',
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

// export const updateProfile = (
//   firebaseId,
//   profileName,
//   email,
//   phone,
//   address,
//   image
// ) => {
//   return (dispatch, getState) => {
//     const token = getState().auth.token;
//     const userId = getState().auth.userId;

//     fetch(
//       'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
//       {
//         method: 'POST',
//         body: JSON.stringify({
//           image: image, //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
//         }),
//       }
//     )
//       .catch((err) =>
//         console.log('error when trying to post to cloudfunctions', err)
//       )
//       .then((res) => res.json())
//       .then((parsedRes) => {
//         const profileData = {
//           profileName,
//           email,
//           phone,
//           address,
//           image: parsedRes.image, //This is how we link to the image we store above
//         };

//         return fetch(
//           `https://egnahemsfabriken.firebaseio.com/profiles/${firebaseId}.json?auth=${token}`,
//           {
//             method: 'PATCH',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(profileData),
//           }
//         )
//           .catch((err) =>
//             console.log(
//               'Error when attempting to save profile to firebase realtime database: ',
//               err
//             )
//           )
//           .then((finalRes) => finalRes.json())
//           .then((finalResParsed) => {
//             dispatch({
//               type: UPDATE_PROFILE,
//               currUser: userId,
//               fid: firebaseId,
//               profileData: {
//                 profileName,
//                 email,
//                 phone,
//                 address,
//                 image,
//               },
//             });
//           });
//       });
//   };
// };
