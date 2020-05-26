import Project from '../../models/project';
import { convertImage } from '../helpers';

export const DELETE_PROJECT = 'DELETE_PROJECT';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const SET_PROJECTS = 'SET_PROJECTS';

export function fetchProjects() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    // Perform the API call - fetching all projects
    try {
      console.log('Fetching projects...');
      const response = await fetch('https://egnahemsfabriken.firebaseio.com/projects.json');
      const resData = await response.json();
      const loadedProjects = [];
      for (const key in resData) {
        loadedProjects.push(
          new Project(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].location,
            resData[key].description,
            resData[key].image,
            resData[key].slogan,
            resData[key].date,
            resData[key].status
          )
        );
      }
      console.log('Fetching projects...');
      // Set our projects in the reducer
      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects,
        userProjects: loadedProjects.filter((proj) => proj.ownerId === userId),
      });
      console.log('...projects fetched!');
    } catch (error) {
      console.log('Error in actions/projects/fetchProjects: ', error);
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
      const message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PROJECT, pid: projectId });
  };
};

export function createProject(title, location, description, slogan, image, status) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    try {
      console.log('START----------actions/projects/createProject--------');

      //First convert the base64 image to a firebase url...
      const convertedImage = await dispatch(convertImage(image));
      const projectData = {
        title,
        location,
        description,
        slogan,
        image: convertedImage.image, //This is how we link to the image we store above
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
          location,
          description,
          slogan,
          image: convertedImage.image,
          ownerId: userId,
          date: currentDate,
          status,
        },
      });

      console.log('----------actions/projects/createProject--------END');
    } catch (error) {
      console.log(error);

      console.log('----------actions/projects/createProject--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProject(id, title, location, description, slogan, image) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
      console.log('START----------actions/projects/updateProject--------');

      let dataToUpdate = {
        title,
        location,
        description,
        slogan,
        image,
      };

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        const convertedImage = await dispatch(convertImage(image));
        dataToUpdate = {
          title,
          location,
          description,
          slogan,
          image: convertedImage.image, //This is how we link to the image we store above
        };
      }

      // Perform the API call - create the project, passing the projectData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/projects/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          body: JSON.stringify(dataToUpdate),
        }
      );
      const returnedProjectData = await response.json();

      console.log('returnedProjectData from updating project, after patch', returnedProjectData);

      console.log('dispatching UPDATE_PROJECT');

      dispatch({
        type: UPDATE_PROJECT,
        pid: id,
        projectData: dataToUpdate,
      });

      console.log('----------actions/projects/updateProject--------END');
    } catch (error) {
      console.log(error);
      console.log('----------actions/projects/updateProject--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}
