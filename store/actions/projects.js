import Project from '../../models/project';

export const DELETE_PROJECT = 'DELETE_PROJECT';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const SET_PROJECTS = 'SET_PROJECTS';

export const fetchProjects = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/projects.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadedProjects = [];

      for (const key in resData) {
        loadedProjects.push(
          new Project(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].image,
            resData[key].slogan,
            resData[key].date,
            resData[key].status
          )
        );
      }

      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects,
        userProjects: loadedProjects.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProject = projectId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/projects/${projectId}.json?auth=${token}`,
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
    dispatch({ type: DELETE_PROJECT, pid: projectId });
  };
};

export const createProject = (title, slogan, image, status) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();

    //First upload the base64 image
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
        const projectData = {
          title,
          slogan,
          image: parsedRes.image, //This is how we link to the image we store above
          ownerId: userId,
          date: date.toISOString(),
          status
        };

        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/projects.json?auth=${token}`,
          {
            method: 'POST',
            body: JSON.stringify(projectData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: CREATE_PROJECT,
              projectData: {
                id: finalResParsed.name,
                title,
                slogan,
                image,
                ownerId: userId,
                date: date,
                status
              }
            });
          });
      });
  };
};

export const updateProject = (id, title, slogan, image) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    //First upload the base64 image
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
        const projectData = {
          title,
          slogan,
          image: parsedRes.image //This is how we link to the image we store above
        };

        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/projects/${id}.json?auth=${token}`,
          {
            method: 'PATCH',
            body: JSON.stringify(projectData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            dispatch({
              type: UPDATE_PROJECT,
              pid: id,
              projectData: {
                title,
                slogan,
                image
              }
            });
          });
      });
  };
};
