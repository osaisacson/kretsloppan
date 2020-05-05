import Product from '../../models/product';

export const LOADING = 'LOADING';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

import { convertImage } from '../helpers';

export function updateReservedProduct(id, token) {
  return async (dispatch) => {
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log(
        'START----------actions/products/updateReservedProduct--------'
      );
      console.log('id: ', id);
      console.log('token: ', token);

      //Since the products reservation date has passed, reset these values as:
      const updatedProduct = {
        reservedUserId: '',
        newOwnerId: '',
        status: 'redo',
        pauseDate: '',
        readyDate: new Date().toISOString(), //Current date
        reservedDate: '',
        reservedUntil: '',
        collectedDate: '',
        projectId: '',
      };

      console.log('updatedProduct to be sent to API: ', updatedProduct);

      // Perform the API call - update the product that has been expired
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      const updatedData = await response.json();
      console.log(
        'actions/products/updateReservedProduct returned updated data after API call',
        updatedData
      );
      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: {
          reservedUserId: updatedData.reservedUserId,
          newOwnerId: updatedData.newOwnerId,
          status: updatedData.status,
          pauseDate: updatedData.pauseDate,
          readyDate: updatedData.readyDate,
          reservedDate: updatedData.reservedDate,
          reservedUntil: updatedData.reservedUntil,
          collectedDate: updatedData.collectedDate,
          projectId: updatedData.projectId,
        },
      });
      console.log(
        '----------actions/products/updateReservedProduct--------END'
      );
      return updatedData;
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/updateReservedProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function fetchProducts() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    const token = getState().auth.token;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    ('START----------actions/products/fetchProducts--------');

    // Perform the API call - fetching all products
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );
      const resData = await response.json();

      const loadedProducts = [];

      console.log(
        'Checking if any of the product reservation dates have expired: '
      );
      for (const key in resData) {
        //Is the product reservation expired?
        const reservationExpiryDate = new Date(resData[key].reservedUntil);
        const isPickedUp = resData[key].status === 'hämtad';
        const shouldBeReset =
          !isPickedUp &&
          reservationExpiryDate instanceof Date &&
          reservationExpiryDate <= new Date();

        //If the product has expired, call a function which passes correct new fields and then push the updated product to the loadedProducts array
        if (shouldBeReset) {
          console.log(
            'Found expired product, calling updateReservedProduct ------>'
          );
          const updatedResult = await dispatch(
            updateReservedProduct(key, token)
          );
          console.log(
            '---------> ...updated result received from updateReservedProduct, updating product with: '
          );
          console.log('id: ', key);
          console.log('updatedResult: ', updatedResult);
          console.log(
            `${key} product was expired, pushing updated product to loadedProducts`
          );
          loadedProducts.push(
            new Product(
              key,
              updatedResult.ownerId,
              updatedResult.reservedUserId,
              updatedResult.newOwnerId,
              updatedResult.categoryName,
              updatedResult.condition,
              updatedResult.title,
              updatedResult.image,
              updatedResult.address,
              updatedResult.phone,
              updatedResult.description,
              updatedResult.price,
              updatedResult.date,
              updatedResult.status,
              updatedResult.pauseDate,
              updatedResult.readyDate,
              updatedResult.reservedDate,
              updatedResult.reservedUntil,
              updatedResult.collectedDate,
              updatedResult.projectId
            )
          );
        }
        //If the product was not expired, push the original to the loadedProducts array
        console.log(`${key} clear!`);
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].reservedUserId,
            resData[key].newOwnerId,
            resData[key].categoryName,
            resData[key].condition,
            resData[key].title,
            resData[key].image,
            resData[key].address,
            resData[key].phone,
            resData[key].description,
            resData[key].price,
            resData[key].date,
            resData[key].status,
            resData[key].pauseDate,
            resData[key].readyDate,
            resData[key].reservedDate,
            resData[key].reservedUntil,
            resData[key].collectedDate,
            resData[key].projectId
          )
        );
      }
      console.log('Dispatch SET_PRODUCTS, passing it loadedProducts');
      // Set our products in the reducer
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
      // Set a loading flag to false in the reducer
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/fetchProducts--------END');
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/fetchProducts--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export function createProduct(
  categoryName,
  condition,
  title,
  image,
  address,
  phone,
  description,
  price
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    try {
      console.log('START----------actions/products/createProduct--------');

      //First convert the base64 image to a firebase url...
      const convertedImage = await dispatch(convertImage(image));

      console.log(
        'returned result from the convertImage function: ',
        convertedImage
      );

      //...then take the returned image and together with the rest of the data create the productData object.
      const productData = {
        ownerId: userId,
        reservedUserId: '',
        newOwnerId: '',
        categoryName,
        condition,
        title,
        image: convertedImage.image, //This is how we link to the image we create through the convertImage function
        address,
        phone,
        description,
        price,
        date: currentDate,
        status: 'redo',
        pauseDate: '',
        readyDate: currentDate,
        reservedDate: '',
        reservedUntil: '',
        collectedDate: '',
        projectId: '000',
      };

      // Perform the API call - create the product, passing the productData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/products.json?auth=${token}`,
        {
          method: 'POST',
          body: JSON.stringify(productData),
        }
      );
      const returnedProductData = await response.json();

      console.log('dispatching CREATE_PRODUCT');

      dispatch({
        type: CREATE_PRODUCT,
        productData: {
          id: returnedProductData.name,
          ownerId: userId,
          reservedUserId: '',
          newOwnerId: '',
          categoryName,
          condition,
          title,
          image: convertedImage.image,
          address,
          phone,
          description,
          price,
          date: currentDate,
          status: 'redo',
          readyDate: currentDate,
          pauseDate: '',
          readyDate: currentDate,
          reservedDate: '',
          reservedUntil: '',
          collectedDate: '',
          projectId: '000',
        },
      });
      console.log('----------actions/products/createProduct--------END');
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      console.log('ERROR: ', error);
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/createProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProduct(
  id,
  categoryName,
  condition,
  title,
  image,
  address,
  phone,
  description,
  price
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });

    //If we are NOT passing a base64 image, update with the old image and passed data
    let dataToUpdate = {
      categoryName,
      condition,
      title,
      image,
      address,
      phone,
      description,
      price,
    };

    try {
      console.log('START----------actions/products/updateProduct--------');

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        //First convert the base64 image to a firebase url...
        const convertedImage = await dispatch(convertImage(image));
        //...then take the returned image and update our dataToUpdate object
        console.log(
          'returned result from the convertImage function: ',
          convertedImage
        );

        dataToUpdate = {
          categoryName,
          condition,
          title,
          image: convertedImage.image,
          address,
          phone,
          description,
          price,
        };
      }

      // Perform the API call - create the product, passing the productData object above
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          body: JSON.stringify(dataToUpdate),
        }
      );
      const returnedProductData = await response.json();

      console.log(
        'returnedProductData from updating product, after patch',
        returnedProductData
      );

      console.log('dispatching UPDATE_PRODUCT');

      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: dataToUpdate,
      });

      console.log('----------actions/products/updateProduct--------END');
      dispatch({ type: 'LOADING', loading: false });
    } catch (error) {
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/updateProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export const changeProductStatus = (id, status, projectId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const currentUserId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    const isReady = status === 'redo';
    const isPaused = status === 'bearbetas';
    const isReserved = status === 'reserverad';
    const isCollected = status === 'hämtad';

    //Getting a date one week from now, to use for updated reservedUntil if status is 'reserved'
    var firstDay = new Date();
    const oneWeekFromNow = new Date(
      firstDay.getTime() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    //If we are updating the status to reserved, change the reserved fields to match the current user and date.
    let updatedReservedUserId = isReserved ? currentUserId : '';
    let updatedReservedDate = isReserved ? currentDate : '';
    let updatedReservedUntil = isReserved ? oneWeekFromNow : '';
    let updatedProjectId = projectId ? projectId : '000';

    //If we are updating the status to collected, set the new owner if and the date it was collected.
    let updatedNewOwnerId = isCollected ? currentUserId : '';
    let updatedCollectedDate = isCollected ? currentDate : '';

    //If we are updating the status to paused, set the date when the product was paused to today.
    let updatedPauseDate = isPaused ? currentDate : '';

    //If we are updating the status to ready, set the date when the product was made available again to today.
    let updatedReadyDate = isReady ? currentDate : '';

    const productDataToUpdate = {
      reservedUserId: updatedReservedUserId,
      newOwnerId: updatedNewOwnerId,
      status,
      pauseDate: updatedPauseDate,
      readyDate: updatedReadyDate,
      reservedDate: updatedReservedDate,
      reservedUntil: updatedReservedUntil,
      collectedDate: updatedCollectedDate,
      projectId: updatedProjectId,
    };

    try {
      await fetch(
        `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productDataToUpdate),
        }
      );

      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: productDataToUpdate,
      });
    } catch (error) {
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
};
