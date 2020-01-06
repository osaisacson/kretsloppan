import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';

import CartItem from '../../models/cart-item';

//By having these separate reducers (cart, product...) in redux managing the state becomes easier. They all get combined into one rootReducer in App.js
const initialState = {
  items: {},
  totalAmount: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product; //we get the action.product from the product: product defined in actions/cart.j
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrNewCardItem;

      //Find out if product is already part of the inital state 'items'. If the id of whatever product we add is found in items...
      if (state.items[addedProduct.id]) {
        //...then we already have the item in the cart, and need to update it.
        updatedOrNewCardItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        //otherwise create and add a new item to the cart (comes from models/cart-item.js)
        updatedOrNewCardItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      //return a copy of the original state (so as to not overwrite anything), and set items equal to a new object where we copy all the existing state and then add a new dynamic key to which we set the newCartItem object.
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCardItem }, //using [] lets us use dynamic values, for example here where the id changes
        totalAmount: state.totalAmount + prodPrice
      };

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.pid]; //dynamically accesses the value with the passed product id (action.pid) from the items object. The items object is being defined in the initialState above. The data 'items' contains comes from the data we add to it in the above addToCart logic.
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        //reduce the number of items if the quantity of items with the same pid (same products) is bigger than 1
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1, //reduce quantity of items by one
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice //update price to take one item off the sum
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem }; //copy of the existing items where we replace the old cart item that has this id with a new cart item that has mostly same info as before but with updated quantity and sum. Effectively removing one item from that id.
      } else {
        //erase the item
        updatedCartItems = { ...state.items }; //copy of current state
        delete updatedCartItems[action.pid]; //delete the item with the specified id (dynamic action.pid) from the items object
      }
      return {
        ...state,
        items: updatedCartItems, //update the items in the state with the updatedCartItems defined in the if/else above
        totalAmount: state.totalAmount - selectedCartItem.productPrice //remove one item from the total price. This will be right regardless of the if/else above as we always remove one item with this action.
      };
    case ADD_ORDER:
      return initialState; //Clear the cart after adding the order, by resetting the state to an empty object as per the initialState above
    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItems = { ...state.items }; //copy of current state
      const itemTotal = state.items[action.pid].sum;
      delete updatedItems[action.pid]; //delete the item with the specified id (dynamic action.pid) from the items object
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      };
  }
  return state;
};
