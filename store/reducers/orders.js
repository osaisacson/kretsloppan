import Order from '../../models/order';
import { DELETE_ORDER, CREATE_ORDER, UPDATE_ORDER, SET_ORDERS } from '../actions/orders';
import { getIndex, updateCollection } from '../helpers';

const initialState = {
  availableOrders: [],
  userOrders: [],
  loading: false,
};

export default (state = initialState, action) => {
  //Switch cases
  switch (action.type) {
    case SET_ORDERS:
      return {
        availableOrders: action.orders,
        userOrders: action.userOrders,
      };

    case CREATE_ORDER: {
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.productId,
        action.orderData.buyerId,
        action.orderData.sellerId,
        action.orderData.projectId,
        action.orderData.image,
        action.orderData.quantity,
        action.orderData.createdOn,
        action.orderData.reservedUntil,
        action.orderData.suggestedDate,
        action.orderData.buyerAgreed,
        action.orderData.sellerAgreed,
        action.orderData.isCollected
      );
      console.log('store/reducers/orders/CREATE_ORDER, new order: ', newOrder);
      return {
        ...state,
        availableOrders: state.availableOrders.concat(newOrder),
        userOrders: state.userOrders.concat(newOrder),
      };
    }
    case UPDATE_ORDER: {
      const availableOrderIndex = getIndex(state.availableOrders, action.pid);
      const updatedUserOrder = new Order( //Whenever we do a new order we have to pass the full params to match model
        action.pid,
        state.availableOrders[availableOrderIndex].productId,
        state.availableOrders[availableOrderIndex].buyerId,
        state.availableOrders[availableOrderIndex].sellerId,
        action.orderData.projectId,
        state.availableOrders[availableOrderIndex].image,
        action.orderData.quantity,
        state.availableOrders[availableOrderIndex].createdOn,
        action.orderData.reservedUntil,
        action.orderData.suggestedDate,
        action.orderData.buyerAgreed,
        action.orderData.sellerAgreed,
        action.orderData.isCollected
      );
      console.log('store/reducers/orders/UPDATE_ORDER, updated order: ', updatedUserOrder);

      //Update state
      const updatedAvailableOrders = updateCollection(
        state.availableOrders,
        action.pid,
        updatedUserOrder
      );
      const updatedUserOrders = updateCollection(state.userOrders, action.pid, updatedUserOrder);

      return {
        ...state,
        availableOrders: updatedAvailableOrders,
        userOrders: updatedUserOrders,
      };
    }

    case DELETE_ORDER:
      return {
        ...state,
        availableOrders: state.availableOrders.filter((order) => order.id !== action.pid),
        userOrders: state.userOrders.filter((order) => order.id !== action.pid),
      };
  }
  return state;
};
