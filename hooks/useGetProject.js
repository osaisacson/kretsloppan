import { useQuery } from 'react-query';
import firebase from 'firebase';

const getProjects = async () => {
  const data = await firebase.database().ref('projects').once('value');
  const normalizedProjectData = data.val();
  const projectData = [];

  for (const key in normalizedProjectData) {
    const project = normalizedProjectData[key];
    projectData.push({
      id: key,
      ...project,
    });
  }

  return projectData;
};

export default function useGetProjects() {
  return useQuery('projects', getProjects);
}
