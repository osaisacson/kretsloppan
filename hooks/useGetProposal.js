import React from 'react';
import useGetProposals from './useGetProposals';
import Loader from './../components/UI/Loader';
import { Text } from 'react-native';

// TBD: This should be remade to use react query cache similar to the example below
export default function useGetProposal(proposalId) {
  const { isLoading, isError, data, error } = useGetProposals();
  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading proposal with id ${proposalId} via the useGetProposal hook...`);
    return <Loader />;
  }
  return data.find((d) => d.id == proposalId);
}

// import { useQuery, QueryClient } from 'react-query';
// import { getProposals } from './useGetProposals';

// const queryClient = new QueryClient();

// export default function useGetProposal(proposalId) {
//   return useQuery(
//     ['proposals', proposalId],
//     () => {
//       getProposals().find((d) => d.id == proposalId);
//     },
//     {
//       initialData: () => {
//         return queryClient.getQueryData('proposals')?.find((d) => d.id == proposalId);
//       },
//       initialStale: true,
//     }
//   );
// }
