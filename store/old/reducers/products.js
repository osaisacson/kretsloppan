import PRODUCTS from '../../data/dummy-data';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  SET_PRODUCTS
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter(prod => prod.ownerId === 'u1')
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products, //Set the available products in our store to the ones we fetch in ...actions/products.js fetchProducts()
        userProducts: action.products.filter(prod => prod.ownerId === 'u1')
      };

    case CREATE_PRODUCT:
      //Creates a new product based on the model for products in models/product
      //Data comes from the action as defined in actions/product
      const newProduct = new Product(
        action.productData.id, //created by firebase. check actions/products.js resData.name for more info
        'u1', //ownerid of product, placeholder until real data,
        action.productData.categoryName,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        action.productData.price
      );
      return {
        //update the reducer state above

        ...state,
        availableProducts: state.availableProducts.concat(newProduct), //old array plus a new element (newProduct is the new element)
        userProducts: state.userProducts.concat(newProduct)
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product( //create a new product with updated data
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.categoryName,
        action.productData.title,
        action.productData.imageUrl,
        action.productData.description,
        state.userProducts[productIndex].price //price should not be editable, so we keep the original price for this
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedProduct; //replace the product at this index with the updated product above
      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedProduct; //replace the product at this index with the updated product above
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };

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
