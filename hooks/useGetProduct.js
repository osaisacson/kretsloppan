import React from 'react';
import useGetProducts from './useGetProducts';
import Loader from './../components/UI/Loader';
import { Text } from 'react-native';

// TBD: This should be remade to use react query cache similar to the example below
export default function useGetProduct(productId) {
  const { isLoading, isError, data, error } = useGetProducts();
  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(`Loading product with id ${productId} via the useGetProduct hook...`);
    return <Loader />;
  }
  return data.find((d) => d.id == productId);
}

// import { useQuery, QueryClient } from 'react-query';
// import { getProducts } from './useGetProducts';

// const queryClient = new QueryClient();

// export default function useGetProduct(productId) {
//   return useQuery(
//     ['products', productId],
//     () => {
//       getProducts().find((d) => d.id == productId);
//     },
//     {
//       initialData: () => {
//         return queryClient.getQueryData('products')?.find((d) => d.id == productId);
//       },
//       initialStale: true,
//     }
//   );
// }
