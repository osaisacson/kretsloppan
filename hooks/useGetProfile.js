import useGetProfiles from './useGetProfiles';
import Loader from './../components/UI/Loader';
import { Text } from 'react-native';

// TBD: This should be remade to use react query cache similar to the example below
export default function useGetProfile(profileId) {
  const { isLoading, isError, data, error } = useGetProfiles();
  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading profile with id ${profileId} via the useGetProfile hook...`);
    return <Loader />;
  }
  return data.find((d) => d.id == profileId);
}

// import { useQuery, QueryClient } from 'react-query';
// import { getProfiles } from './useGetProfiles';

// const queryClient = new QueryClient();

// export default function useGetProfile(profileId) {
//   return useQuery(
//     ['profiles', profileId],
//     () => {
//       getProfiles().find((d) => d.id == profileId);
//     },
//     {
//       initialData: () => {
//         return queryClient.getQueryData('profiles')?.find((d) => d.id == profileId);
//       },
//       initialStale: true,
//     }
//   );
// }
