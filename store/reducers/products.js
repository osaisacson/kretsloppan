import Product from '../../models/product';
import {
  DELETE_PRODUCT,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  CHANGE_PRODUCT_STATUS,
  SET_PRODUCTS,
  CHANGE_PRODUCT_AGREEMENT,
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
    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.productData.id,
        action.productData.ownerId,
        action.productData.reservedUserId,
        action.productData.collectingUserId,
        action.productData.newOwnerId,
        action.productData.category,
        action.productData.condition,
        action.productData.style,
        action.productData.material,
        action.productData.color,
        action.productData.title,
        action.productData.image,
        action.productData.address,
        action.productData.phone,
        action.productData.description,
        action.productData.length,
        action.productData.height,
        action.productData.width,
        action.productData.price,
        action.productData.priceText,
        action.productData.date,
        action.productData.status,
        action.productData.readyDate,
        action.productData.reservedDate,
        action.productData.reservedUntil,
        action.productData.suggestedDate,
        action.productData.collectingDate,
        action.productData.collectedDate,
        action.productData.projectId,
        action.productData.internalComments,
        action.productData.sellerAgreed,
        action.productData.buyerAgreed
      );
      console.log('store/reducers/products/CREATE_PRODUCT, new product: ', newProduct);
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      };
    case UPDATE_PRODUCT:
      const userProductIndex = getIndex(state.userProducts, action.pid);
      const updatedUserProduct = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        state.userProducts[userProductIndex].reservedUserId,
        state.userProducts[userProductIndex].collectingUserId,
        state.userProducts[userProductIndex].newOwnerId,
        action.productData.category,
        action.productData.condition,
        action.productData.style,
        action.productData.material,
        action.productData.color,
        action.productData.title,
        action.productData.image,
        action.productData.address,
        action.productData.phone,
        action.productData.description,
        action.productData.length,
        action.productData.height,
        action.productData.width,
        action.productData.price,
        action.productData.priceText,
        action.productData.date,
        state.userProducts[userProductIndex].status,
        state.userProducts[userProductIndex].readyDate,
        state.userProducts[userProductIndex].reservedDate,
        state.userProducts[userProductIndex].reservedUntil,
        state.userProducts[userProductIndex].suggestedDate,
        state.userProducts[userProductIndex].collectingDate,
        state.userProducts[userProductIndex].collectedDate,
        state.userProducts[userProductIndex].projectId,
        action.productData.internalComments,
        state.userProducts[userProductIndex].sellerAgreed,
        state.userProducts[userProductIndex].buyerAgreed
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
    case CHANGE_PRODUCT_STATUS:
      const availableProductsIndexCPS = getIndex(state.availableProducts, action.pid);

      const updatedProductCPS = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[availableProductsIndexCPS].ownerId,
        action.productData.reservedUserId,
        action.productData.collectingUserId,
        action.productData.newOwnerId,
        state.availableProducts[availableProductsIndexCPS].category,
        state.availableProducts[availableProductsIndexCPS].condition,
        state.availableProducts[availableProductsIndexCPS].style,
        state.availableProducts[availableProductsIndexCPS].material,
        state.availableProducts[availableProductsIndexCPS].color,
        state.availableProducts[availableProductsIndexCPS].title,
        state.availableProducts[availableProductsIndexCPS].image,
        state.availableProducts[availableProductsIndexCPS].address,
        state.availableProducts[availableProductsIndexCPS].phone,
        state.availableProducts[availableProductsIndexCPS].description,
        state.availableProducts[availableProductsIndexCPS].length,
        state.availableProducts[availableProductsIndexCPS].height,
        state.availableProducts[availableProductsIndexCPS].width,
        state.availableProducts[availableProductsIndexCPS].price,
        state.availableProducts[availableProductsIndexCPS].priceText,
        state.availableProducts[availableProductsIndexCPS].date,
        action.productData.status,
        action.productData.readyDate,
        action.productData.reservedDate,
        action.productData.reservedUntil,
        action.productData.suggestedDate,
        action.productData.collectingDate,
        action.productData.collectedDate,
        action.productData.projectId,
        state.availableProducts[availableProductsIndexCPS].internalComments,
        state.availableProducts[availableProductsIndexCPS].sellerAgreed,
        state.availableProducts[availableProductsIndexCPS].buyerAgreed
      );

      console.log(
        'store/reducers/products/CHANGE_PRODUCT_STATUS, updated product: ',
        updatedProductCPS
      );
      //Update state
      const updatedAvailableProductsCPS = updateCollection(
        state.availableProducts,
        action.pid,
        updatedProductCPS
      );
      const updatedUserProductsCPS = updateCollection(
        state.userProducts,
        action.pid,
        updatedProductCPS
      );

      return {
        ...state,
        availableProducts: updatedAvailableProductsCPS,
        userProducts: updatedUserProductsCPS,
      };
    case CHANGE_PRODUCT_AGREEMENT:
      const productIndexAg = getIndex(state.availableProducts, action.pid);

      const updatedProductAgreement = new Product( //Whenever we do a new product we have to pass the full params to match model
        action.pid,
        state.availableProducts[productIndexAg].ownerId,
        state.availableProducts[productIndexAg].reservedUserId,
        state.availableProducts[productIndexAg].collectingUserId,
        state.availableProducts[productIndexAg].newOwnerId,
        state.availableProducts[productIndexAg].category,
        state.availableProducts[productIndexAg].condition,
        state.availableProducts[productIndexAg].style,
        state.availableProducts[productIndexAg].material,
        state.availableProducts[productIndexAg].color,
        state.availableProducts[productIndexAg].title,
        state.availableProducts[productIndexAg].image,
        state.availableProducts[productIndexAg].address,
        state.availableProducts[productIndexAg].phone,
        state.availableProducts[productIndexAg].description,
        state.availableProducts[productIndexAg].length,
        state.availableProducts[productIndexAg].height,
        state.availableProducts[productIndexAg].width,
        state.availableProducts[productIndexAg].price,
        state.availableProducts[productIndexAg].priceText,
        state.availableProducts[productIndexAg].date,
        state.availableProducts[productIndexAg].status,
        state.availableProducts[productIndexAg].readyDate,
        state.availableProducts[productIndexAg].reservedDate,
        state.availableProducts[productIndexAg].reservedUntil,
        state.availableProducts[productIndexAg].suggestedDate,
        state.availableProducts[productIndexAg].collectingDate,
        state.availableProducts[productIndexAg].collectedDate,
        state.availableProducts[productIndexAg].projectId,
        state.availableProducts[productIndexAg].internalComments,
        action.productData.sellerAgreed,
        action.productData.buyerAgreed
      );

      console.log(
        'store/reducers/products/CHANGE_PRODUCT_STATUS, updated product: ',
        updatedProductAgreement
      );
      //Update state
      const updatedAvailableProductsAgreement = updateCollection(
        state.availableProducts,
        action.pid,
        updatedProductAgreement
      );
      const updatedUserProductsAgreement = updateCollection(
        state.userProducts,
        action.pid,
        updatedProductAgreement
      );

      return {
        ...state,
        availableProducts: updatedAvailableProductsAgreement,
        userProducts: updatedUserProductsAgreement,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter((product) => product.id !== action.pid),
        userProducts: state.userProducts.filter((product) => product.id !== action.pid),
      };
  }
  return state;
};
