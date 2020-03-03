import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  RESERVE_PRODUCT,
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
        action.productData.reservedUntil,
        action.productData.projectId
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct)
      };
    case UPDATE_PRODUCT:
      const userProductIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        action.productData.categoryName,
        action.productData.title,
        action.productData.image,
        action.productData.description,
        action.productData.price,
        state.userProducts[userProductIndex].date,
        state.userProducts[userProductIndex].status,
        state.userProducts[userProductIndex].reservedUntil,
        state.userProducts[userProductIndex].projectId
      );
      const updatedUserProducts = [...state.userProducts]; //copy current state of user products
      updatedUserProducts[userProductIndex] = updatedUserProduct; //find the user product with the passed index (the one we should update)
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
      const allProductsIndexCPS = state.availableProducts.findIndex(
        //Look through all products, not just userProducts as when we update a product above
        prod => prod.id === action.pid
      );

      const updatedProductCPS = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[allProductsIndexCPS].ownerId, //Keep all the same except...
        state.availableProducts[allProductsIndexCPS].categoryName,
        state.availableProducts[allProductsIndexCPS].title,
        state.availableProducts[allProductsIndexCPS].image,
        state.availableProducts[allProductsIndexCPS].description,
        state.availableProducts[allProductsIndexCPS].price,
        state.availableProducts[allProductsIndexCPS].date,
        action.productData.status, //...status
        state.availableProducts[allProductsIndexCPS].reservedUntil,
        state.availableProducts[allProductsIndexCPS].projectId
      );
      const updatedUserProductsCPS = [...state.userProducts];
      updatedUserProductsCPS[allProductsIndexCPS] = updatedProductCPS;
      const updatedAllProductsCPS = [...state.availableProducts];
      updatedAllProductsCPS[allProductsIndexCPS] = updatedProductCPS;
      return {
        ...state,
        availableProducts: updatedAllProductsCPS,
        userProducts: updatedUserProductsCPS
      };
    case RESERVE_PRODUCT:
      const prodIndex = state.availableProducts.findIndex(
        //Look through all products, not just userProducts as when we update a product above
        prod => prod.id === action.pid
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
        action.productData.reservedUntil, //...reservedUntil
        action.productData.projectId //...project the product is tied to. Defaults to '' if not present.
      );
      const updatedStatusUserProducts = [...state.userProducts];
      updatedStatusUserProducts[prodIndex] = updatedProduct;

      const updatedAllProducts = [...state.availableProducts];
      updatedAllProducts[prodIndex] = updatedProduct;
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
