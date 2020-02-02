import Profile from '../../models/profile';

export const DELETE_PROFILE = 'DELETE_PROFILE';
export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_PROFILES = 'SET_PROFILES';

export const fetchProfiles = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
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
            resData[key].id,
            resData[key].name,
            resData[key].phone,
            resData[key].email
          )
        );
      }

      dispatch({
        type: SET_PROFILES,
        profiles: loadedProfiles,
        userProfiles: loadedProfiles.filter(prof => prof.id === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProfile = profileId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/profiles/${profileId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PROFILE, pid: profileId });
  };
};

export const createProfile = (id, name, phone, email) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/profiles.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          name,
          phone,
          email
        })
      }
    );

    const resData = await response.json();

    console.log('resdata from creating a profile: ', resData);

    dispatch({
      type: CREATE_PROFILE,
      profileData: {
        id,
        name,
        phone,
        email
      }
    });
  };
};

export const updateProfile = (
  id,
  categoryName,
  title,
  description,
  imageUrl
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/profiles/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: UPDATE_PROFILE,
      pid: id,
      profileData: {
        categoryName,
        title,
        description,
        imageUrl
      }
    });
  };
};
