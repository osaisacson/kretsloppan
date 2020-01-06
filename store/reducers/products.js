import PRODUCTS from '../../data/dummy-data';
import { DELETE_PRODUCT } from '../actions/products';

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
};

export default (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state, //copy state to make sure we dont loose any state
        //Update the userProducts by not including any item where the id doesnt match watch we give
        userProducts: state.userProducts.filter(
          //the filter function runs the defined below on every product in the array and if it returns true we keep that item, if it returns false we drop it. Then it returns a new array with the results.
          product => product.id !== action.pid //for each product check their id and the id we pass. if the id's don't match then return false and don't include it (efffectively deletes it from the new array)
        ),
        //Update the availableProducts accordingly
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};
