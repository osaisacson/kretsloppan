import { useQuery } from 'react-query';
import firebase from 'firebase';

const getOrders = async () => {
  const data = await firebase.database().ref('orders').once('value');
  const normalizedOrderData = data.val();
  const orderData = [];

  for (const key in normalizedOrderData) {
    const order = normalizedOrderData[key];
    orderData.push({
      id: key,
      ...order,
    });
  }

  return orderData;
};

export default function useGetOrders() {
  return useQuery('orders', getOrders);
}
