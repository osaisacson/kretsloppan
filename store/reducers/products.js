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
        action.productData.status,
        action.productData.reservedUntil
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
        action.productData.status,
        state.userProducts[productIndex].reservedUntil
      );
      const updatedUserProducts = [...state.userProducts]; //copy current state of user products
      updatedUserProducts[productIndex] = updatedUserProduct; //find the user product with the passed index (the one we should update)
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
      const prodIndex = state.availableProducts.findIndex(
        //Look through all products, not just userProducts as when we update a product above
        prod => prod.id === action.pid
      );
      console.log(
        'change product status in reducers to action.productData.reservedUntil: ',
        action.productData.reservedUntil
      );

      const updatedProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[prodIndex].ownerId, //Keep all the same except...
        state.availableProducts[prodIndex].categoryName,
        state.availableProducts[prodIndex].title,
        state.availableProducts[prodIndex].image,
        state.availableProducts[prodIndex].description,
        state.availableProducts[prodIndex].price,
        state.availableProducts[prodIndex].date,
        action.productData.status, //...status
        action.productData.reservedUntil //...reservedUntil
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
