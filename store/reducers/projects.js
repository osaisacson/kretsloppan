import {
  DELETE_PROJECT,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  SET_PROJECTS,
} from '../actions/projects';
import Project from '../../models/project';

const initialState = {
  availableProjects: [],
  userProjects: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        availableProjects: action.projects,
        userProjects: action.userProjects,
      };
    case CREATE_PROJECT:
      const newProject = new Project(
        action.projectData.id,
        action.projectData.ownerId,
        action.projectData.title,
        action.projectData.image,
        action.projectData.slogan,
        action.projectData.date,
        action.projectData.status
      );
      console.log(
        'store/reducers/projects/CREATE_PROJECT, new project: ',
        newProject
      );
      return {
        ...state,
        availableProjects: state.availableProjects.concat(newProject),
        userProjects: state.userProjects.concat(newProject),
      };
    case UPDATE_PROJECT:
      const userProjectIndex = state.userProjects.findIndex(
        (proj) => proj.id === action.pid
      );
      console.log(
        'store/reducers/projects/UPDATE_PROJECT, original project: ',
        state.userProjects[userProjectIndex]
      );
      const updatedUserProject = new Project( //Whenever we do a new project we have to pass the full params to match model
        action.pid,
        state.userProjects[userProjectIndex].ownerId,
        action.projectData.title,
        action.projectData.image,
        action.projectData.slogan,
        state.userProjects[userProjectIndex].date,
        state.userProjects[userProjectIndex].status
      );
      console.log(
        'store/reducers/projects/UPDATE_PROJECT, updated project: ',
        updatedUserProject
      );
      const updatedUserProjects = [...state.userProjects]; //copy current state of user projects
      updatedUserProjects[userProjectIndex] = updatedUserProject; //find the user project with the passed index (the one we should update)
      const availableProjectIndex = state.availableProjects.findIndex(
        (proj) => proj.id === action.pid
      );
      const updatedAvailableProjects = [...state.availableProjects];
      updatedAvailableProjects[availableProjectIndex] = updatedUserProject;
      return {
        ...state,
        availableProjects: updatedAvailableProjects,
        userProjects: updatedUserProjects,
      };
    case DELETE_PROJECT:
      return {
        ...state,
        userProjects: state.userProjects.filter(
          (project) => project.id !== action.pid
        ),
        availableProjects: state.availableProjects.filter(
          (project) => project.id !== action.pid
        ),
      };
  }
  return state;
};
