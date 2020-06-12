import firebase from 'firebase';

import Project from '../../models/project';
import { convertImage } from '../helpers';

export const DELETE_PROJECT = 'DELETE_PROJECT';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const SET_PROJECTS = 'SET_PROJECTS';

export function fetchProjects() {
  return async (dispatch, getState) => {
    const uid = getState().auth.userId;

    try {
      console.log('Fetching projects...');
      const projectSnapshot = await firebase.database().ref('projects').once('value');

      if (projectSnapshot.exists) {
        const normalizedProjectData = projectSnapshot.val();
        const allProjects = [];
        const userProjects = [];

        for (const key in normalizedProjectData) {
          const project = normalizedProjectData[key];
          const newProject = new Project(
            key,
            project.ownerId,
            project.title,
            project.location,
            project.description,
            project.image,
            project.slogan,
            project.date,
            project.status
          );

          allProjects.push(newProject);

          if (project.ownerId === uid) {
            userProjects.push(newProject);
          }
        }

        dispatch({
          type: SET_PROJECTS,
          projects: allProjects,
          userProjects,
        });
        console.log(`Projects:`);
        console.log(`...${allProjects.length} total projects found and loaded.`);
        console.log(`...${userProjects.length} projects created by the user found and loaded.`);
      }
    } catch (error) {
      console.log('Error in actions/projects/fetchProjects: ', error);
      throw error;
    }
  };
}

export const deleteProject = (projectId) => {
  return async (dispatch) => {
    try {
      console.log(`Attempting to delete project with id: ${projectId}...`);
      await firebase.database().ref(`projects/${projectId}`).remove();

      dispatch({ type: DELETE_PROJECT, pid: projectId });
      console.log(`...project deleted!`);
    } catch (error) {
      console.log('Error in actions/projects/deleteProject: ', error);
      throw new Error(error.message);
    }
  };
};

export function createProject(title, location, description, slogan, image, status = null) {
  return async (dispatch, getState) => {
    const currentDate = new Date().toISOString();
    const ownerId = getState().auth.userId;

    try {
      console.log('Attempting to create new project...');

      //First convert the base64 image to a firebase url...
      const convertedImage = await dispatch(convertImage(image));
      const projectData = {
        title,
        location,
        description,
        slogan,
        image: convertedImage.image, //This is how we link to the image we store above
        ownerId,
        date: currentDate,
        status,
      };

      const { key } = await firebase.database().ref('projects').push(projectData);

      dispatch({
        type: CREATE_PROJECT,
        projectData: {
          id: key,
          title,
          location,
          description,
          slogan,
          image: convertedImage.image,
          ownerId,
          date: currentDate,
          status,
        },
      });

      console.log(`...created new project with id ${key}:`, projectData);
    } catch (error) {
      console.log('Error in actions/projects/createProject: ', error);
      throw error;
    }
  };
}

export function updateProject(id, title, location, description, slogan, image) {
  return async (dispatch) => {
    try {
      console.log(`Attempting to update project with id: ${id}...`);

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

      const returnedProjectData = await firebase
        .database()
        .ref(`projects/${id}`)
        .update(dataToUpdate);

      console.log(`...updated project with id ${id}:`, returnedProjectData);

      dispatch({
        type: UPDATE_PROJECT,
        pid: id,
        projectData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/projects/updateProject: ', error);
      throw error;
    }
  };
}
