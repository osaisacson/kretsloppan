import Profile from '../../models/profile';

export const SET_PROFILES = 'SET_PROFILES';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const fetchProfiles = () => {
  return async dispatch => {
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
            resData[key].profileId,
            resData[key].profileName,
            resData[key].email,
            resData[key].phone,
            resData[key].image,
            resData[key].date
          )
        );
      }

      // console.log('allProfiles in actions', loadedProfiles);

      dispatch({
        type: SET_PROFILES,
        allProfiles: loadedProfiles
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const createProfile = (profileName, email, phone, image) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        })
      }
    )
      .catch(err =>
        console.log('error when trying to post to cloudfunctions', err)
      )
      .then(res => res.json())
      .then(parsedRes => {
        const profileData = {
          profileId: userId, //Set profileId to be the userId of the logged in user: we get this from auth
          profileName,
          email,
          phone,
          image: parsedRes.image //This is how we link to the image we store above
        };

        return fetch(
          `https://egnahemsfabriken.firebaseio.com/profiles.json?auth=${token}`,
          {
            method: 'POST',
            body: JSON.stringify(profileData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save profile to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: CREATE_PROFILE,
              profileData: {
                profileId: userId,
                profileName,
                email,
                phone,
                image
              }
            });
          });
      });
  };
};

export const updateProfile = (profileName, email, phone, image) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        })
      }
    )
      .catch(err =>
        console.log('error when trying to post to cloudfunctions', err)
      )
      .then(res => res.json())
      .then(parsedRes => {
        const profileData = {
          profileId: userId,
          profileName,
          email,
          phone,
          image: parsedRes.image //This is how we link to the image we store above
        };

        return fetch(
          `https://egnahemsfabriken.firebaseio.com/profiles/${profileId}.json?auth=${token}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save profile to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: UPDATE_PROFILE,
              uid: userId,
              profileData: {
                profileId: userId,
                profileName,
                email,
                phone,
                image
              }
            });
          });
      });
  };
};
