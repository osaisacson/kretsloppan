export const ADD_ORDER = 'ADD_ORDER';

export const addOrder = (cartItems, totalAmount) => {
  //expects to be passed our cartItems that are for ordering, and the total amount they... amount to.
  return {
    type: ADD_ORDER,
    orderData: { items: cartItems, amount: totalAmount }
  };
};
