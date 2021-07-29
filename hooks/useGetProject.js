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

const useProjects = (select) => useQuery(['projects'], getProjects, { select });

export default function useGetProject(id) {
  return useProjects((projects) => projects.find((project) => project.id === id));
}
