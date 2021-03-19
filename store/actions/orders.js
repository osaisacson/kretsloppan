import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Order from '../../models/order';

export const DELETE_ORDER = 'DELETE_ORDER';
export const CREATE_ORDER = 'CREATE_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export function fetchOrders() {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log('Fetching orders...');
      const orderSnapshot = await firebase.database().ref('orders').once('value');

      if (orderSnapshot.exists) {
        const normalizedOrderData = orderSnapshot.val();

        const allOrders = [];
        const userOrders = [];

        for (const key in normalizedOrderData) {
          const order = normalizedOrderData[key];
          const newOrder = new Order(
            key,
            order.productId,
            order.buyerId,
            order.sellerId,
            order.timeInitiatorId,
            order.projectId,
            order.image,
            order.quantity,
            order.createdOn,
            order.suggestedDate,
            order.isAgreed,
            order.isCollected
          );

          allOrders.push(newOrder);

          if (order.buyerId === uid) {
            userOrders.push(newOrder);
          }
        }

        await dispatch({
          type: SET_ORDERS,
          orders: allOrders,
          userOrders,
        });
        console.log(`Orders:`, allOrders);
        console.log(`...${allOrders.length} total orders found and loaded.`);
        console.log(`...${userOrders.length} orders created by the user found and loaded.`);
      }
    } catch (error) {
      console.log('Error in actions/orders/fetchOrders: ', error);
      throw error;
    }
  };
}

export const deleteOrder = (orderId) => {
  return async (dispatch) => {
    try {
      console.log(`Attempting to delete order with id: ${orderId}...`);
      await firebase.database().ref(`orders/${orderId}`).remove();

      dispatch({ type: DELETE_ORDER, pid: orderId });
      console.log(`...order deleted!`);
    } catch (error) {
      console.log('Error in actions/orders/deleteOrder: ', error);
      throw new Error(error.message);
    }
  };
};

export function createOrder(
  productId,
  sellerId,
  timeInitiatorId,
  projectId,
  image,
  quantity,
  suggestedDate
) {
  return async (dispatch) => {
    const currentDate = new Date();
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const buyerId = userData.userId;

    try {
      const orderData = {
        productId,
        buyerId,
        sellerId,
        timeInitiatorId,
        projectId,
        image,
        quantity,
        createdOn: currentDate,
        suggestedDate,
        isAgreed: false,
        isCollected: false,
      };
      console.log('Actions/createOrder attempting to create order with data: ', orderData);

      const { key } = await firebase.database().ref('orders').push(orderData);

      const newOrderData = {
        ...orderData,
        id: key,
      };

      console.log('XXXXX SUGGESTED DATE in createOrder....: ', suggestedDate);

      dispatch({
        type: CREATE_ORDER,
        orderData: newOrderData,
      });
      console.log(`...created new order with id ${key}:`, newOrderData);
    } catch (error) {
      console.log('Error in actions/orders/createOrder: ', error);
      throw error;
    }
  };
}

export function updateOrder(
  id,
  timeInitiatorId,
  projectId,
  quantity,
  suggestedDate,
  isAgreed,
  isCollected
) {
  return async (dispatch) => {
    const currentDate = new Date();
    try {
      console.log(`Attempting to update order with id: ${id}...`);

      const dataToUpdate = {
        timeInitiatorId,
        projectId,
        quantity,
        createdOn: currentDate,
        suggestedDate,
        isAgreed,
        isCollected,
      };

      const returnedOrderData = await firebase.database().ref(`orders/${id}`).update(dataToUpdate);

      console.log(`...updated order with id ${id}:`, returnedOrderData);

      dispatch({
        type: UPDATE_ORDER,
        pid: id,
        orderData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/orders/updateOrder: ', error);
      throw error;
    }
  };
}
