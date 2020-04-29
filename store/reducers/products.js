import { getIndex, updateCollection } from './helperFunctions';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  CHANGE_PRODUCT_STATUS,
  SET_PRODUCTS,
} from '../actions/products';
import Product from '../../models/product';

const initialState = {
  availableProducts: [],
  userProducts: [],
  reservedProducts: [],
};

export default (state = initialState, action) => {
  //Switch cases
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
        reservedProducts: action.reservedProducts,
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.reservedUserId,
        action.productData.newOwnerId,
        action.productData.categoryName,
        action.productData.condition,
        action.productData.title,
        action.productData.image,
        action.productData.address,
        action.productData.phone,
        action.productData.description,
        action.productData.price,
        action.productData.date,
        action.productData.status,
        action.productData.pauseDate,
        action.productData.readyDate,
        action.productData.reservedDate,
        action.productData.reservedUntil,
        action.productData.collectedDate,
        action.productData.projectId
      );
      console.log(
        'store/reducers/products/CREATE_PRODUCT, new product: ',
        newProduct
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
        reservedProducts: state.reservedProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const userProductIndex = getIndex(state.userProducts, action.pid);
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        state.userProducts[userProductIndex].reservedUserId,
        state.userProducts[userProductIndex].newOwnerId,
        action.productData.categoryName,
        action.productData.condition,
        action.productData.title,
        action.productData.image,
        action.productData.address,
        action.productData.phone,
        action.productData.description,
        action.productData.price,
        action.productData.date,
        state.userProducts[userProductIndex].status,
        state.userProducts[userProductIndex].pauseDate,
        state.userProducts[userProductIndex].readyDate,
        state.userProducts[userProductIndex].reservedDate,
        state.userProducts[userProductIndex].reservedUntil,
        state.userProducts[userProductIndex].collectedDate,
        state.userProducts[userProductIndex].projectId
      );
      console.log(
        'store/reducers/products/UPDATE_PRODUCT, updated product: ',
        updatedUserProduct
      );

      //Update state
      updatedAvailableProducts = updateCollection(
        state.availableProducts,
        action.pid,
        updatedUserProduct
      );
      updatedUserProducts = updateCollection(
        state.userProducts,
        action.pid,
        updatedUserProduct
      );
      updatedReservedProducts = updateCollection(
        state.reservedProducts,
        action.pid,
        updatedUserProduct
      );

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
        reservedProducts: updatedReservedProducts,
      };
    case CHANGE_PRODUCT_STATUS:
      const availableProductsIndexCPS = getIndex(
        state.availableProducts,
        action.pid
      );

      console.log(
        'store/reducers/products/CHANGE_PRODUCT_STATUS, original product: ',
        state.availableProducts[availableProductsIndexCPS]
      );

      const updatedProductCPS = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[availableProductsIndexCPS].ownerId,
        action.productData.reservedUserId,
        action.productData.newOwnerId,
        state.availableProducts[availableProductsIndexCPS].categoryName,
        state.availableProducts[availableProductsIndexCPS].condition,
        state.availableProducts[availableProductsIndexCPS].title,
        state.availableProducts[availableProductsIndexCPS].image,
        state.availableProducts[availableProductsIndexCPS].address,
        state.availableProducts[availableProductsIndexCPS].phone,
        state.availableProducts[availableProductsIndexCPS].description,
        state.availableProducts[availableProductsIndexCPS].price,
        state.availableProducts[availableProductsIndexCPS].date,
        action.productData.status,
        action.productData.pauseDate,
        action.productData.readyDate,
        action.productData.reservedDate,
        action.productData.reservedUntil,
        action.productData.collectedDate,
        action.productData.projectId
      );

      console.log(
        'store/reducers/products/CHANGE_PRODUCT_STATUS, updated product: ',
        updatedProductCPS
      );
      //Update state
      updatedAvailableProductsCPS = updateCollection(
        state.availableProducts,
        action.pid,
        updatedProductCPS
      );
      updatedUserProductsCPS = updateCollection(
        state.userProducts,
        action.pid,
        updatedProductCPS
      );
      updatedReservedProductsCPS = updateCollection(
        state.reservedProducts,
        action.pid,
        updatedProductCPS
      );

      return {
        ...state,
        availableProducts: updatedAvailableProductsCPS,
        userProducts: updatedUserProductsCPS,
        reservedProducts: updatedReservedProductsCPS,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
        availableProducts: state.availableProducts.filter(
          (product) => product.id !== action.pid
        ),
        reservedProducts: state.reservedProducts.filter(
          (product) => product.id !== action.pid
        ),
      };
  }
  return state;
};
