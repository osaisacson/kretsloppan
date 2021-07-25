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

const useProducts = (select) => useQuery(['products'], getProducts, { select });

export default function useGetProduct(id) {
  return useProducts((products) => products.find((product) => product.id === id));
}
