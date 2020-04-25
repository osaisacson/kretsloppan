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
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.products,
        userProducts: action.userProducts,
      };
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.reservedUserId,
        action.productData.newOwnerId,
        action.productData.categoryName,
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
      };
    case UPDATE_PRODUCT:
      const userProductIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        state.userProducts[userProductIndex].reservedUserId,
        state.userProducts[userProductIndex].newOwnerId,
        action.productData.categoryName,
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
      const updatedUserProducts = [...state.userProducts]; //copy current state of user products
      updatedUserProducts[userProductIndex] = updatedUserProduct; //find the user product with the passed index (the one we should update)
      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      const updatedAvailableProducts = [...state.availableProducts];
      updatedAvailableProducts[availableProductIndex] = updatedUserProduct;
      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      };
    case CHANGE_PRODUCT_STATUS:
      const allProductsIndexCPS = state.availableProducts.findIndex(
        //Look through all products, not just userProducts as when we update a product above
        (prod) => prod.id === action.pid
      );

      console.log(
        'store/reducers/products/CHANGE_PRODUCT_STATUS, original product: ',
        state.availableProducts[allProductsIndexCPS]
      );

      const updatedProductCPS = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[allProductsIndexCPS].ownerId,
        action.productData.reservedUserId,
        action.productData.newOwnerId,
        state.availableProducts[allProductsIndexCPS].categoryName,
        state.availableProducts[allProductsIndexCPS].title,
        state.availableProducts[allProductsIndexCPS].image,
        state.availableProducts[allProductsIndexCPS].address,
        state.availableProducts[allProductsIndexCPS].phone,
        state.availableProducts[allProductsIndexCPS].description,
        state.availableProducts[allProductsIndexCPS].price,
        state.availableProducts[allProductsIndexCPS].date,
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
      //Update this product in availableProducts
      const updatedAllProductsCPS = [...state.availableProducts];
      updatedAllProductsCPS[allProductsIndexCPS] = updatedProductCPS;
      //Update this product in userProducts
      const updatedUserProductsCPS = [...state.userProducts];
      const userProductIndexCPS = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      );
      updatedUserProductsCPS[userProductIndexCPS] = updatedProductCPS;

      return {
        ...state,
        availableProducts: updatedAllProductsCPS,
        userProducts: updatedUserProductsCPS,
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
      };
  }
  return state;
};
