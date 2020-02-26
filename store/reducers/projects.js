import {
  DELETE_PROJECT,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  SET_PROJECTS
} from '../actions/projects';
import Project from '../../models/project';

const initialState = {
  availableProjects: [],
  userProjects: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        availableProjects: action.projects,
        userProjects: action.userProjects
      };
    case CREATE_PROJECT:
      const newProject = new Project(
        action.projectData.id,
        action.projectData.ownerId,
        action.projectData.title,
        action.projectData.image,
        action.projectData.description,
        action.projectData.date,
        action.projectData.status,
        (availableProjects: [])
      );
      return {
        ...state,
        availableProjects: state.availableProjects.concat(newProject),
        userProjects: state.userProjects.concat(newProject)
      };
    case UPDATE_PROJECT:
      const userProjectIndex = state.userProjects.findIndex(
        proj => proj.id === action.pid
      );
      const updatedUserProject = new Project( //Whenever we do a new project we have to pass the full params to match model
        action.pid,
        state.userProjects[userProjectIndex].ownerId,
        action.projectData.title,
        action.projectData.image,
        action.projectData.description,
        state.userProjects[userProjectIndex].date,
        action.userProjects[userProjectIndex].status
      );
      const updatedUserProjects = [...state.userProjects]; //copy current state of user projects
      updatedUserProjects[userProjectIndex] = updatedUserProject; //find the user project with the passed index (the one we should update)
      const availableProjectIndex = state.availableProjects.findIndex(
        proj => proj.id === action.pid
      );
      const updatedAvailableProjects = [...state.availableProjects];
      updatedAvailableProjects[availableProjectIndex] = updatedUserProject;
      return {
        ...state,
        availableProjects: updatedAvailableProjects,
        userProjects: updatedUserProjects
      };
    case DELETE_PROJECT:
      return {
        ...state,
        userProjects: state.userProjects.filter(
          project => project.id !== action.pid
        ),
        availableProjects: state.availableProjects.filter(
          project => project.id !== action.pid
        )
      };
  }
  return state;
};
