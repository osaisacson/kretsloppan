import React from 'react';
import useGetOrders from './useGetOrders';
import Loader from './../components/UI/Loader';
import { Text } from 'react-native';

// TBD: This should be remade to use react query cache similar to the example below
export default function useGetOrder(productId) {
  const { isLoading, isError, data, error } = useGetOrders();
  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(
      `Loading order belonging to product with id ${productId} via the useGetOrder hook...`
    );
    return <Loader />;
  }
  return data.find((d) => d.productId == productId); //checks if the order productId matches the passed productId
}

// import { useQuery, QueryClient } from 'react-query';
// import { getOrders } from './useGetOrders';

// const queryClient = new QueryClient();

// export default function useGetOrder(productId) {
//   return useQuery(
//     ['orders', productId],
//     () => {
//       getOrders().find((d) => d.id == productId);
//     },
//     {
//       initialData: () => {
//         return queryClient.getQueryData('orders')?.find((d) => d.id == productId);
//       },
//       initialStale: true,
//     }
//   );
// }
