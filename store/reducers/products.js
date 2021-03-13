import Product from '../../models/product';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_BOOKED_PRODUCTS,
  UPDATE_PRODUCT_SOLD_AMOUNT,
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
        action.productData.internalComments,
        action.productData.booked,
        action.productData.sold
      );
      console.log('store/reducers/products/CREATE_PRODUCT, new product: ', newProduct);
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    }
    case UPDATE_PRODUCT: {
      const availableProductIndex = getIndex(state.availableProducts, action.pid);
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
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
        state.availableProducts[availableProductIndex].date,
        action.productData.internalComments,
        action.productData.booked,
        action.productData.sold
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
    // case UPDATE_BOOKED_PRODUCTS: {
    //   const availableProductIndex = getIndex(state.availableProducts, action.pid);
    //   const updatedAmountProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
    //     action.pid,
    //     state.availableProducts[availableProductIndex].ownerId,
    //     state.availableProducts[availableProductIndex].category,
    //     state.availableProducts[availableProductIndex].condition,
    //     state.availableProducts[availableProductIndex].style,
    //     state.availableProducts[availableProductIndex].material,
    //     state.availableProducts[availableProductIndex].color,
    //     state.availableProducts[availableProductIndex].title,
    //     state.availableProducts[availableProductIndex].amount,
    //     state.availableProducts[availableProductIndex].image,
    //     state.availableProducts[availableProductIndex].address,
    //     state.availableProducts[availableProductIndex].location,
    //     state.availableProducts[availableProductIndex].pickupDetails,
    //     state.availableProducts[availableProductIndex].phone,
    //     state.availableProducts[availableProductIndex].description,
    //     state.availableProducts[availableProductIndex].background,
    //     state.availableProducts[availableProductIndex].length,
    //     state.availableProducts[availableProductIndex].height,
    //     state.availableProducts[availableProductIndex].width,
    //     state.availableProducts[availableProductIndex].price,
    //     state.availableProducts[availableProductIndex].priceText,
    //     state.availableProducts[availableProductIndex].date,
    //     state.availableProducts[availableProductIndex].internalComments,
    //     action.productData.booked,
    //     state.availableProducts[availableProductIndex].sold
    //   );
    //   console.log(
    //     'store/reducers/products/UPDATE_BOOKED_PRODUCTS, updated product: ',
    //     updatedAmountProduct
    //   );

    //   //Update state
    //   const updatedAvailableProducts = updateCollection(
    //     state.availableProducts,
    //     action.pid,
    //     updatedAmountProduct
    //   );
    //   const updatedUserProducts = updateCollection(
    //     state.userProducts,
    //     action.pid,
    //     updatedAmountProduct
    //   );

    //   return {
    //     ...state,
    //     availableProducts: updatedAvailableProducts,
    //     userProducts: updatedUserProducts,
    //   };
    // }
    // case UPDATE_PRODUCT_SOLD_AMOUNT: {
    //   const availablePIndex = getIndex(state.availableProducts, action.pid);
    //   const updatedSoldProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
    //     action.pid,
    //     state.availableProducts[availablePIndex].ownerId,
    //     state.availableProducts[availablePIndex].category,
    //     state.availableProducts[availablePIndex].condition,
    //     state.availableProducts[availablePIndex].style,
    //     state.availableProducts[availablePIndex].material,
    //     state.availableProducts[availablePIndex].color,
    //     state.availableProducts[availablePIndex].title,
    //     state.availableProducts[availablePIndex].amount,
    //     state.availableProducts[availablePIndex].image,
    //     state.availableProducts[availablePIndex].address,
    //     state.availableProducts[availablePIndex].location,
    //     state.availableProducts[availablePIndex].pickupDetails,
    //     state.availableProducts[availablePIndex].phone,
    //     state.availableProducts[availablePIndex].description,
    //     state.availableProducts[availablePIndex].background,
    //     state.availableProducts[availablePIndex].length,
    //     state.availableProducts[availablePIndex].height,
    //     state.availableProducts[availablePIndex].width,
    //     state.availableProducts[availablePIndex].price,
    //     state.availableProducts[availablePIndex].priceText,
    //     state.availableProducts[availablePIndex].date,
    //     state.availableProducts[availablePIndex].internalComments,
    //     state.availableProducts[availablePIndex].booked,
    //     action.productData.sold
    //   );
    //   console.log(
    //     'store/reducers/products/UPDATE_PRODUCT_SOLD_AMOUNT, updated product: ',
    //     updatedSoldProduct
    //   );

    //   //Update state
    //   const updatedSoldProducts = updateCollection(
    //     state.availableProducts,
    //     action.pid,
    //     updatedSoldProduct
    //   );
    //   const updatedUserProducts = updateCollection(
    //     state.userProducts,
    //     action.pid,
    //     updatedSoldProduct
    //   );

    //   return {
    //     ...state,
    //     availableProducts: updatedSoldProducts,
    //     userProducts: updatedUserProducts,
    //   };
    // }
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter((product) => product.id !== action.pid),
        userProducts: state.userProducts.filter((product) => product.id !== action.pid),
      };
  }
  return state;
};
