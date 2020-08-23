import Product from '../../models/product';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_AMOUNT,
  CHANGE_PRODUCT_STATUS,
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
      const availableProductsIndex = getIndex(state.availableProducts, action.pid);
      const updatedProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[availableProductsIndex].ownerId,
        state.availableProducts[availableProductsIndex].category,
        state.availableProducts[availableProductsIndex].condition,
        state.availableProducts[availableProductsIndex].style,
        state.availableProducts[availableProductsIndex].material,
        state.availableProducts[availableProductsIndex].color,
        state.availableProducts[availableProductsIndex].title,
        action.productData.amount,
        state.availableProducts[availableProductsIndex].image,
        state.availableProducts[availableProductsIndex].address,
        state.availableProducts[availableProductsIndex].location,
        state.availableProducts[availableProductsIndex].pickupDetails,
        state.availableProducts[availableProductsIndex].phone,
        state.availableProducts[availableProductsIndex].description,
        state.availableProducts[availableProductsIndex].background,
        state.availableProducts[availableProductsIndex].length,
        state.availableProducts[availableProductsIndex].height,
        state.availableProducts[availableProductsIndex].width,
        state.availableProducts[availableProductsIndex].price,
        state.availableProducts[availableProductsIndex].priceText,
        state.availableProducts[availableProductsIndex].date,
        state.availableProducts[availableProductsIndex].internalComments
      );
      console.log('store/reducers/products/UPDATE_PRODUCT, updated product: ', updatedProduct);

      //Update state
      const updatedAvailableProducts = updateCollection(
        state.availableProducts,
        action.pid,
        updatedProduct
      );
      const updatedProducts = updateCollection(state.userProducts, action.pid, updatedProduct);

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedProducts,
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
