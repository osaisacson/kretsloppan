import Project from '../../models/project';

export const LOADING = 'LOADING';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const SET_PROJECTS = 'SET_PROJECTS';

import { convertImage } from '../helpers';

export function fetchProjects() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    ('START----------actions/projects/fetchProjects--------');

    // Perform the API call - fetching all projects
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/projects.json'
      );
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
      console.log('Dispatch SET_PROJECTS, passing it loadedProjects');
      // Set our projects in the reducer
      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects,
        userProjects: loadedProjects.filter((proj) => proj.ownerId === userId),
      });
      // Set a loading flag to false in the reducer
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/projects/fetchProjects--------END');
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/projects/fetchProjects--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export const deleteProject = (projectId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/projects/${projectId}.json?auth=${token}`,
      {
        method: 'DELETE',
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

export function createProject(title, slogan, image, status) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/projects/createProject--------');

      //First convert the base64 image to a firebase url...
      return dispatch(convertImage(image)).then(
        async (parsedRes) => {
          //...then take the returned image and...
          console.log(
            'returned result from the convertImage function: ',
            parsedRes
          );

          //...together with the rest of the data create the projectData object.
          const projectData = {
            title,
            slogan,
            image: parsedRes.image, //This is how we link to the image we store above
            ownerId: userId,
            date: currentDate,
            status,
          };

          // Perform the API call - create the project, passing the projectData object above
          const response = await fetch(
            `https://egnahemsfabriken.firebaseio.com/projects.json?auth=${token}`,
            {
              method: 'POST',
              body: JSON.stringify(projectData),
            }
          );
          const returnedProjectData = await response.json();

          console.log('dispatching CREATE_PRODUCT');

          dispatch({
            type: CREATE_PROJECT,
            projectData: {
              id: returnedProjectData.name,
              title,
              slogan,
              image: parsedRes.image,
              ownerId: userId,
              date: currentDate,
              status,
            },
          });

          console.log('----------actions/projects/createProject--------END');
          dispatch({ type: 'LOADING', loading: false });
        },
        (error) => {
          dispatch({ type: 'LOADING', loading: false });
          throw error;
        }
      );
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/projects/createProject--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProject(id, title, slogan, image) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    try {
      console.log('START----------actions/projects/updateProject--------');

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
              title,
              slogan,
              image: parsedRes.image, //This is how we link to the image we store above
            };

            // Perform the API call - create the project, passing the projectData object above
            const response = await fetch(
              `https://egnahemsfabriken.firebaseio.com/projects/${id}.json?auth=${token}`,
              {
                method: 'PATCH',
                body: JSON.stringify(dataToUpdate),
              }
            );
            const returnedProjectData = await response.json();

            console.log(
              'returnedProjectData from updating project, after patch',
              returnedProjectData
            );

            console.log('dispatching UPDATE_PROJECT');

            dispatch({
              type: UPDATE_PROJECT,
              pid: id,
              projectData: dataToUpdate,
            });

            console.log('----------actions/projects/updateProject--------END');
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
        title,
        slogan,
        image,
      };

      // Perform the API call - create the project, passing the projectData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/projects/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          body: JSON.stringify(dataToUpdate),
        }
      );
      const returnedProjectData = await response.json();

      console.log(
        'returnedProjectData from updating project, after patch',
        returnedProjectData
      );

      console.log('dispatching UPDATE_PROJECT');

      dispatch({
        type: UPDATE_PROJECT,
        pid: id,
        projectData: dataToUpdate,
      });

      console.log('----------actions/projects/updateProject--------END');
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/projects/updateProject--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}
