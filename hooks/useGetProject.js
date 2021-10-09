import React from 'react';
import useGetProjects from './useGetProjects';
import Loader from './../components/UI/Loader';
import { Text } from 'react-native';

// TBD: This should be remade to use react query cache similar to the example below
export default function useGetProject(projectId) {
  const { isLoading, isError, data, error } = useGetProjects();
  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading project with id ${projectId} via the useGetProject hook...`);
    return <Loader />;
  }
  return data.find((d) => d.id == projectId);
}

// import { useQuery, QueryClient } from 'react-query';
// import { getProjects } from './useGetProjects';

// const queryClient = new QueryClient();

// export default function useGetProject(projectId) {
//   return useQuery(
//     ['projects', projectId],
//     () => {
//       getProjects().find((d) => d.id == projectId);
//     },
//     {
//       initialData: () => {
//         return queryClient.getQueryData('projects')?.find((d) => d.id == projectId);
//       },
//       initialStale: true,
//     }
//   );
// }
