// Identifiers
export const ADD_TO_CART = 'ADD_TO-CART'; //This is just to make sure we avoid spelling mistakes when using the action
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

//Action creator functions - these can be called upon through passing them to useDispatch() in the relevant screen. The actual logic behind these functions is being defined in reducers/cart.js.
export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};

export const removeFromCart = productId => {
  return { type: REMOVE_FROM_CART, pid: productId };
};
