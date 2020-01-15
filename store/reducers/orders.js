import { ADD_ORDER, SET_ORDERS } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  //sets the initial state to be the one managed by redux (originally the empty array above if we haven't added any orders yet), and receives an action passed through the actions/orders.js via useDispatch( *action* ) in the relevant screen.
  switch (action.type) {
    case SET_ORDERS:
      return {
        orders: action.orders
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.amount,
        action.orderData.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder) //concat adds a new item to the existing array and returns a new array. This allows us to update this in an immutable way where we don't touch the original data but set the new state by creating a brand new array that includes the new object.
      };
  }

  return state;
};
