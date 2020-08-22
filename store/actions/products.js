import firebase from 'firebase';
import { AsyncStorage } from 'react-native';

import Product from '../../models/product';
import { convertImage } from '../helpers';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const UPDATE_PRODUCT_AMOUNT = 'UPDATE_PRODUCT_AMOUNT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const CHANGE_PRODUCT_AGREEMENT = 'CHANGE_PRODUCT_AGREEMENT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export function fetchProducts() {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const uid = userData.userId;

    try {
      console.log('Fetching products...');
      const productSnapshot = await firebase.database().ref('products').once('value');

      if (productSnapshot.exists) {
        const normalizedProductData = productSnapshot.val();
        const allProducts = [];
        const userProducts = [];
        const expiredProducts = [];

        for (const key in normalizedProductData) {
          const product = normalizedProductData[key];
          const newProduct = new Product(
            key,
            product.ownerId,
            product.reservedUserId,
            product.collectingUserId,
            product.newOwnerId,
            product.category,
            product.condition,
            product.style,
            product.material,
            product.color,
            product.title,
            product.amount,
            product.image,
            product.address,
            product.location,
            product.pickupDetails,
            product.phone,
            product.description,
            product.background,
            product.length,
            product.height,
            product.width,
            product.price,
            product.priceText,
            product.date,
            product.status,
            product.readyDate,
            product.reservedDate,
            product.reservedUntil,
            product.suggestedDate,
            product.collectingDate,
            product.collectedDate,
            product.projectId,
            product.internalComments,
            product.sellerAgreed,
            product.buyerAgreed
          );

          allProducts.push(newProduct);

          if (product.ownerId === uid) {
            userProducts.push(newProduct);
          }

          //Is the product reservation expired?
          if (
            product.status === 'reserverad' &&
            !product.collectingDate &&
            new Date(product.reservedUntil) instanceof Date &&
            new Date(product.reservedUntil) <= new Date()
          ) {
            console.log(
              `...product with the name '${product.title}' has an expired reservation date. Pushing it to expiredProducts array.`
            );
            expiredProducts.push(newProduct);
          }
        }

        await dispatch({
          type: SET_PRODUCTS,
          products: allProducts,
          userProducts,
        });
        console.log(`Products:`);
        console.log(`...${allProducts.length} total products found and loaded.`);
        console.log(`...${userProducts.length} products created by the user found and loaded.`);
        console.log(
          `...${expiredProducts.length} expired products found${
            expiredProducts.length
              ? ', attempting to update these...'
              : ', moving on with our lives...'
          }`
        );
        //If the product has expired, call a function which passes correct new fields and then push the updated product to the reservedItems array
        if (expiredProducts.length) {
          expiredProducts.forEach(function (prod) {
            dispatch(unReserveProduct(prod.id));
            console.log(`...'${prod.id}' product was expired, but is now updated.`);
          });
        }
      }
    } catch (error) {
      console.log('Error in actions/products/fetchProducts: ', error);
      throw error;
    }
  };
}

export function unReserveProduct(id) {
  return async (dispatch) => {
    try {
      console.log(`Product with id ${id} is expired.`);
      //Since the products reservation date has passed and no collectingDate has been set, reset these values as:
      const updatedProduct = {
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: '',
        status: 'redo',
        readyDate: new Date().toISOString(), //Current date
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: '',
        sellerAgreed: '',
        buyerAgreed: '',
      };

      console.log('Data to update expired product with: ', updatedProduct);

      // Perform the API call - update the product that has been expired
      const returnedProductData = await firebase
        .database()
        .ref(`products/${id}`)
        .update(updatedProduct);

      console.log('Data expired product was updated to:', returnedProductData);

      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: updatedProduct,
      });
    } catch (error) {
      console.log('Error in actions/products/unReserveProduct: ', error);
      throw error;
    }
  };
}

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    try {
      console.log(`Attempting to delete product with id: ${productId}...`);
      await firebase.database().ref(`products/${productId}`).remove();

      dispatch({ type: DELETE_PRODUCT, pid: productId });
      console.log(`...product deleted!`);
    } catch (error) {
      console.log('Error in actions/products/deleteProduct: ', error);
      throw new Error(error.message);
    }
  };
};

export function createProduct(
  category,
  condition,
  style,
  material,
  color,
  title,
  amount,
  image,
  address,
  location,
  pickupDetails,
  phone,
  description,
  background = '',
  length,
  height,
  width,
  price,
  priceText,
  internalComments
) {
  return async (dispatch) => {
    const currentDate = new Date().toISOString();
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const ownerId = userData.userId;

    try {
      console.log('Creating product...');

      //First convert the base64 image to a firebase url...
      const convertedImage = await dispatch(convertImage(image));
      const productData = {
        date: currentDate,
        ownerId,
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: '',
        category,
        condition,
        style,
        material,
        color,
        title,
        amount,
        image: convertedImage.image,
        address,
        location,
        pickupDetails,
        phone,
        description,
        background,
        length,
        height,
        width,
        price,
        priceText,
        status: 'redo',
        readyDate: currentDate,
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: '000',
        internalComments,
        sellerAgreed: '',
        buyerAgreed: '',
      };

      const { key } = await firebase.database().ref('products').push(productData);

      const newProductData = {
        ...productData,
        id: key,
      };

      dispatch({
        type: CREATE_PRODUCT,
        productData: newProductData,
      });
      console.log(`...created new product with id ${key}:`, newProductData);
    } catch (error) {
      console.log('Error in actions/products/createProduct: ', error);
      throw error;
    }
  };
}

export function copyProduct(
  category,
  condition,
  style,
  material,
  color,
  title,
  amount,
  image,
  address,
  location,
  pickupDetails,
  phone,
  description,
  background,
  length,
  height,
  width,
  price,
  priceText,
  internalComments
) {
  return async (dispatch) => {
    const currentDate = new Date().toISOString();
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const ownerId = userData.userId;

    try {
      console.log('Copying product...');

      const productData = {
        date: currentDate,
        ownerId,
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: '',
        category,
        condition,
        style,
        material,
        color,
        title,
        amount,
        image,
        address,
        location,
        pickupDetails,
        phone,
        description,
        background,
        length,
        height,
        width,
        price,
        priceText,
        status: 'redo',
        readyDate: currentDate,
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: '000',
        internalComments,
        sellerAgreed: '',
        buyerAgreed: '',
      };

      const { key } = await firebase.database().ref('products').push(productData);

      const newProductData = {
        ...productData,
        id: key,
      };

      dispatch({
        type: CREATE_PRODUCT,
        productData: newProductData,
      });
      console.log(`...copied product and gave it the new id of ${key}:`, newProductData);
    } catch (error) {
      console.log('Error in actions/products/copyProduct: ', error);
      throw error;
    }
  };
}

export function updateProduct(
  id,
  category = '',
  condition = '',
  style = '',
  material = '',
  color = '',
  title,
  amount,
  image,
  address = '',
  location = '',
  pickupDetails = '',
  phone,
  description = '',
  background = '',
  length = '',
  height = '',
  width = '',
  price = '',
  priceText = '',
  projectId = '',
  internalComments = ''
) {
  return async (dispatch) => {
    try {
      console.log(`Attempting to update product with id: ${id}...`);

      //If we are NOT passing a base64 image, update with the old image and passed data
      let dataToUpdate = {
        category,
        condition,
        style,
        material,
        color,
        title,
        amount,
        image,
        address,
        location,
        pickupDetails,
        phone,
        description,
        background,
        length,
        height,
        width,
        price,
        priceText,
        projectId,
        internalComments,
      };

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        const convertedImage = await dispatch(convertImage(image));
        dataToUpdate = {
          category,
          condition,
          style,
          material,
          color,
          title,
          amount,
          image: convertedImage.image,
          address,
          location,
          pickupDetails,
          phone,
          description,
          background,
          length,
          height,
          width,
          price,
          priceText,
          projectId,
          internalComments,
        };
      }

      const returnedProductData = await firebase
        .database()
        .ref(`products/${id}`)
        .update(dataToUpdate);

      console.log(`...updated product with id ${id}:`, returnedProductData);

      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/products/updateProduct: ', error);
      throw error;
    }
  };
}

export function updateProductAmount(id, amount) {
  return async (dispatch) => {
    try {
      console.log(`Attempting to update product with id: ${id}...`);

      const dataToUpdate = {
        amount,
      };

      const returnedProductData = await firebase
        .database()
        .ref(`products/${id}`)
        .update(dataToUpdate);

      console.log(`...updated product with id ${id}:`, returnedProductData);

      dispatch({
        type: UPDATE_PRODUCT_AMOUNT,
        pid: id,
        productData: dataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/products/updateProductAmount: ', error);
      throw error;
    }
  };
}

export const changeProductStatus = (
  id,
  status,
  projectId,
  idRelatedToStatus,
  dateRelatedToStatus
) => {
  return async (dispatch) => {
    const userData = await AsyncStorage.getItem('userData').then((data) =>
      data ? JSON.parse(data) : {}
    );
    const currentUserId = userData.userId;

    const currentDate = new Date().toISOString();

    const isReady = status === 'redo';
    const isReserved = status === 'reserverad';
    const isSuggested = status === 'ordnas';
    const isOrganised = status === 'ordnad';
    const isCollected = status === 'hämtad';

    //Getting a date one week from now, to use for updated reservedUntil if status is 'reserved'
    var today = new Date();
    const oneDayFromNow = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString();

    let productDataToUpdate;

    if (isReady) {
      productDataToUpdate = {
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: '',
        status: 'redo',
        readyDate: currentDate,
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: projectId ? projectId : '000',
        sellerAgreed: '',
        buyerAgreed: '',
      };
    }

    if (isReserved) {
      productDataToUpdate = {
        reservedUserId: idRelatedToStatus ? idRelatedToStatus : currentUserId,
        collectingUserId: '',
        newOwnerId: '',
        status: 'reserverad',
        readyDate: '',
        reservedDate: currentDate,
        reservedUntil: oneDayFromNow,
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: projectId ? projectId : '000',
      };
    }

    if (isSuggested) {
      productDataToUpdate = {
        reservedUserId: idRelatedToStatus,
        collectingUserId: '',
        newOwnerId: '',
        status: 'reserverad', //sätt tillbaka status till reserverad
        readyDate: '',
        reservedDate: currentDate,
        reservedUntil: oneDayFromNow,
        suggestedDate: dateRelatedToStatus,
        collectingDate: '',
        collectedDate: '',
        projectId: projectId ? projectId : '000',
      };
    }

    if (isOrganised) {
      productDataToUpdate = {
        reservedUserId: '',
        collectingUserId: idRelatedToStatus,
        newOwnerId: '',
        status: 'ordnad',
        readyDate: '',
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: dateRelatedToStatus,
        collectedDate: '',
        projectId: projectId ? projectId : '000',
      };
    }

    if (isCollected) {
      productDataToUpdate = {
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: idRelatedToStatus,
        status: 'hämtad',
        readyDate: '',
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: currentDate,
        projectId: projectId ? projectId : '000',
      };
    }

    try {
      console.log('Attempting to change product status, and set data to: ', productDataToUpdate);

      const returnedProductData = await firebase
        .database()
        .ref(`products/${id}`)
        .update(productDataToUpdate);

      console.log(`...updated product with id ${id} to:`, returnedProductData);

      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: productDataToUpdate,
      });
    } catch (error) {
      console.log('Error in actions/products/changeProductStatus: ', error);
      throw error;
    }
  };
};

export const changeProductAgreement = (id, sellerAgreed, buyerAgreed) => {
  return async (dispatch) => {
    try {
      console.log('Attempting to change product agreement:');
      console.log('sellerAgreed:', sellerAgreed);
      console.log('buyerAgreed: ', buyerAgreed);

      const returnedProductData = await firebase.database().ref(`products/${id}`).update({
        sellerAgreed,
        buyerAgreed,
      });

      console.log(`...updated product with id ${id} to:`, returnedProductData);

      dispatch({
        type: CHANGE_PRODUCT_AGREEMENT,
        pid: id,
        productData: {
          sellerAgreed,
          buyerAgreed,
        },
      });
    } catch (error) {
      console.log('Error in actions/products/changeProductAgreement: ', error);
      throw error;
    }
  };
};
