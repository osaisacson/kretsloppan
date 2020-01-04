export const ADD_TO_CART = 'ADD_TO-CART'; //This is just to make sure we avoid spelling mistakes when using the action

export const addToCart = product => {
  return { type: ADD_TO_CART, product: product };
};
