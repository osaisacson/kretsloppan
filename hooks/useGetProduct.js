import { useQuery } from 'react-query';
import firebase from 'firebase';

const getProduct = async (productId) => {
  const productRef = await firebase.database().ref(`products/${productId}`).ref.once('value');
  const productData = productRef.on('value', (snap) => {
    var data = [];
    snap.forEach((ss) => {
      data.push(ss.child('name').val());
    });
    console.table([data]);
    return data;
  });

  console.log('PRODUCTDATA IN getProduct', productData);

  return productData;
};

export default function useGetProduct(productId) {
  return useQuery(['product', productId], () => getProduct(productId));
}
