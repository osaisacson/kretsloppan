import firebase from 'firebase';
import { AsyncStorage } from 'react-native';

import Product from '../../models/product';
import { convertImage } from '../helpers';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const UPDATE_PRODUCT_AMOUNT = 'UPDATE_PRODUCT_AMOUNT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
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
            product.readyDate,
            product.internalComments
          );

          allProducts.push(newProduct);

          if (product.ownerId === uid) {
            userProducts.push(newProduct);
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
      }
    } catch (error) {
      console.log('Error in actions/products/fetchProducts: ', error);
      throw error;
    }
  };
}

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
        readyDate: currentDate,
        internalComments,
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
