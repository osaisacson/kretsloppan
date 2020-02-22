import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  CHANGE_PRODUCT_STATUS,
  SET_PRODUCTS
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: [],
  userProducts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.categoryName,
        action.productData.title,
        action.productData.image,
        action.productData.description,
        action.productData.price,
        action.productData.date,
        action.productData.status
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };
    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[productIndex].ownerId,
        action.productData.categoryName,
        action.productData.title,
        action.productData.image,
        action.productData.description,
        action.productData.price,
        state.userProducts[productIndex].date,
        action.productData.status
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[productIndex] = updatedUserProduct;
      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedUserProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts
      };
    case CHANGE_PRODUCT_STATUS:
      const prodIndex = state.products.findIndex(
        //Look through all products, not just userProducts as when we update a product above
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.products[prodIndex].ownerId, //Keep all the same except...
        state.products[prodIndex].categoryName,
        state.products[prodIndex].title,
        state.products[prodIndex].image,
        state.products[prodIndex].description,
        state.products[prodIndex].price,
        state.products[prodIndex].date,
        action.productData.status //...status
      );
      const updatedStatusUserProducts = [...state.userProducts];
      updatedStatusUserProducts[prodIndex] = updatedProduct;
      const allProductsIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAllProducts = [...state.availableProducts];
      updatedAllProducts[allProductsIndex] = updatedProduct;
      return {
        ...state,
        availableProducts: updatedAllProducts,
        userProducts: updatedStatusUserProducts
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          product => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.pid
        )
      };
  }
  return state;
};
