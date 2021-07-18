import { useQuery } from 'react-query';
import firebase from 'firebase';

const getProducts = async () => {
  const data = await firebase.database().ref('products').once('value');
  const normalizedProductData = data.val();
  const productData = [];

  for (const key in normalizedProductData) {
    const product = normalizedProductData[key];
    productData.push({
      id: key,
      ...product,
    });
  }

  return productData;
};

export default function useGetProducts() {
  return useQuery('products', getProducts);
}
