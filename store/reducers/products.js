import Product from '../../models/product';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_AMOUNT,
  SET_PRODUCTS,
} from '../actions/products';
import { getIndex, updateCollection } from '../helpers';

const initialState = {
  availableProducts: [],
  userProducts: [],
  loading: false,
};

export default (state = initialState, action) => {
  //Switch cases
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case CREATE_PRODUCT: {
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.category,
        action.productData.condition,
        action.productData.style,
        action.productData.material,
        action.productData.color,
        action.productData.title,
        action.productData.amount,
        action.productData.image,
        action.productData.address,
        action.productData.location,
        action.productData.pickupDetails,
        action.productData.phone,
        action.productData.description,
        action.productData.background,
        action.productData.length,
        action.productData.height,
        action.productData.width,
        action.productData.price,
        action.productData.priceText,
        action.productData.date,
        action.productData.internalComments
      );
      console.log('store/reducers/products/CREATE_PRODUCT, new product: ', newProduct);
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    }
    case UPDATE_PRODUCT: {
      const userProductIndex = getIndex(state.userProducts, action.pid);
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        action.productData.category,
        action.productData.condition,
        action.productData.style,
        action.productData.material,
        action.productData.color,
        action.productData.title,
        action.productData.amount,
        action.productData.image,
        action.productData.address,
        action.productData.location,
        action.productData.pickupDetails,
        action.productData.phone,
        action.productData.description,
        action.productData.background,
        action.productData.length,
        action.productData.height,
        action.productData.width,
        action.productData.price,
        action.productData.priceText,
        action.productData.date,
        action.productData.internalComments
      );
      console.log('store/reducers/products/UPDATE_PRODUCT, updated product: ', updatedUserProduct);

      //Update state
      const updatedAvailableProducts = updateCollection(
        state.availableProducts,
        action.pid,
        updatedUserProduct
      );
      const updatedUserProducts = updateCollection(
        state.userProducts,
        action.pid,
        updatedUserProduct
      );

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    }
    case UPDATE_PRODUCT_AMOUNT: {
      const availableProductIndex = getIndex(state.availableProducts, action.pid);
      const updatedAvailProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[availableProductIndex].ownerId,
        action.productData.category,
        action.productData.condition,
        action.productData.style,
        action.productData.material,
        action.productData.color,
        action.productData.title,
        action.productData.amount,
        action.productData.image,
        action.productData.address,
        action.productData.location,
        action.productData.pickupDetails,
        action.productData.phone,
        action.productData.description,
        action.productData.background,
        action.productData.length,
        action.productData.height,
        action.productData.width,
        action.productData.price,
        action.productData.priceText,
        action.productData.date,
        action.productData.internalComments
      );
      console.log('store/reducers/products/UPDATE_PRODUCT, updated product: ', updatedAvailProduct);

      //Update state
      const updatedAvailableProducts = updateCollection(
        state.availableProducts,
        action.pid,
        updatedAvailProduct
      );
      const updatedUserProducts = updateCollection(
        state.userProducts,
        action.pid,
        updatedAvailProduct
      );

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    }
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter((product) => product.id !== action.pid),
        userProducts: state.userProducts.filter((product) => product.id !== action.pid),
      };
  }
  return state;
};
