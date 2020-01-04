import { ADD_TO_CART } from '../actions/cart';
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
  }
  return state;
};
