import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

import { convertImage } from '../helpers';

export function unReserveProduct(id) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
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
        'actions/products/unReserveProduct returned updated data after API call',
        updatedData
      );
      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: {
          reservedUserId: updatedData.reservedUserId,
          collectingUserId: updatedData.collectingUserId,
          newOwnerId: updatedData.newOwnerId,
          status: updatedData.status,
          readyDate: updatedData.readyDate,
          reservedDate: updatedData.reservedDate,
          reservedUntil: updatedData.reservedUntil,
          suggestedDate: updatedData.suggestedDate,
          collectingDate: updatedData.collectingDate,
          collectedDate: updatedData.collectedDate,
          projectId: updatedData.projectId,
        },
      });
      console.log('----------actions/products/unReserveProduct--------END');
      return updatedData;
    } catch (error) {
      console.log(error);
      ('----------actions/products/unReserveProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function fetchProducts() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

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
        const collectionIsNotAgreed = !resData[key].collectingDate;
        const shouldBeReset =
          !isPickedUp &&
          collectionIsNotAgreed &&
          reservationExpiryDate instanceof Date &&
          reservationExpiryDate <= new Date();

        //If the product has expired, call a function which passes correct new fields and then push the updated product to the loadedProducts array
        if (shouldBeReset) {
          console.log('EXPIRED PRODUCT: ', resData[key]);
          console.log(
            'Found expired product, calling unReserveProduct ------>'
          );
          const updatedResult = await dispatch(unReserveProduct(key));
          console.log(
            '---------> ...updated result received from unReserveProduct, updating product with: '
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
              updatedResult.collectingUserId,
              updatedResult.newOwnerId,
              updatedResult.category,
              updatedResult.condition,
              updatedResult.style,
              updatedResult.material,
              updatedResult.color,
              updatedResult.title,
              updatedResult.image,
              updatedResult.address,
              updatedResult.phone,
              updatedResult.description,
              updatedResult.length,
              updatedResult.height,
              updatedResult.width,
              updatedResult.price,
              updatedResult.date,
              updatedResult.status,
              updatedResult.readyDate,
              updatedResult.reservedDate,
              updatedResult.reservedUntil,
              updatedResult.suggestedDate,
              updatedResult.collectingDate,
              updatedResult.collectedDate,
              updatedResult.projectId,
              updatedResult.internalComments
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
            resData[key].collectingUserId,
            resData[key].newOwnerId,
            resData[key].category,
            resData[key].condition,
            resData[key].style,
            resData[key].material,
            resData[key].color,
            resData[key].title,
            resData[key].image,
            resData[key].address,
            resData[key].phone,
            resData[key].description,
            resData[key].length,
            resData[key].height,
            resData[key].width,
            resData[key].price,
            resData[key].date,
            resData[key].status,
            resData[key].readyDate,
            resData[key].reservedDate,
            resData[key].reservedUntil,
            resData[key].suggestedDate,
            resData[key].collectingDate,
            resData[key].collectedDate,
            resData[key].projectId,
            resData[key].internalComments
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
      ('----------actions/products/fetchProducts--------END');
    } catch (error) {
      console.log(error);
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
  category,
  condition,
  style,
  material,
  color,
  title,
  image,
  address,
  phone,
  description,
  length,
  height,
  width,
  price,
  internalComments
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    try {
      console.log('START----------actions/products/createProduct--------');

      //First convert the base64 image to a firebase url...
      const convertedImage = await dispatch(convertImage(image));

      //...then take the returned image and together with the rest of the data create the productData object.
      const productData = {
        ownerId: userId,
        reservedUserId: '',
        collectingUserId: '',
        newOwnerId: '',
        category,
        condition,
        style,
        material,
        color,
        title,
        image: convertedImage.image, //This is how we link to the image we create through the convertImage function
        address,
        phone,
        description,
        length,
        height,
        width,
        price,
        date: currentDate,
        status: 'redo',
        readyDate: currentDate,
        reservedDate: '',
        reservedUntil: '',
        suggestedDate: '',
        collectingDate: '',
        collectedDate: '',
        projectId: '000',
        internalComments,
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
          collectingUserId: '',
          newOwnerId: '',
          category,
          condition,
          style,
          material,
          color,
          title,
          image: convertedImage.image,
          address,
          phone,
          description,
          length,
          height,
          width,
          price,
          date: currentDate,
          status: 'redo',
          readyDate: currentDate,
          reservedDate: '',
          reservedUntil: '',
          suggestedDate: '',
          collectingDate: '',
          collectedDate: '',
          projectId: '000',
          internalComments,
        },
      });
      console.log('----------actions/products/createProduct--------END');
    } catch (error) {
      console.log(error);
      ('----------actions/products/createProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

export function updateProduct(
  id,
  category,
  condition,
  style,
  material,
  color,
  title,
  image,
  address,
  phone,
  description,
  length,
  height,
  width,
  price,
  internalComments
) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    //If we are NOT passing a base64 image, update with the old image and passed data
    let dataToUpdate = {
      category,
      condition,
      style,
      material,
      color,
      title,
      image,
      address,
      phone,
      description,
      length,
      height,
      width,
      price,
      internalComments,
    };

    try {
      console.log('START----------actions/products/updateProduct--------');

      //If we are getting a base64 image do an update that involves waiting for it to convert to a firebase url
      if (image.length > 1000) {
        //First convert the base64 image to a firebase url...
        const convertedImage = await dispatch(convertImage(image));
        //...then take the returned image and update our dataToUpdate object

        dataToUpdate = {
          category,
          condition,
          style,
          material,
          color,
          title,
          image: convertedImage.image,
          address,
          phone,
          description,
          length,
          height,
          width,
          price,
          internalComments,
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
    } catch (error) {
      console.log(error);
      ('----------actions/products/updateProduct--------END');
      // Rethrow so returned Promise is rejected
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
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const currentUserId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    const isReady = status === 'redo';
    const isReserved = status === 'reserverad';
    const isSuggested = status === 'ordnas';
    const isOrganised = status === 'ordnad';
    const isCollected = status === 'hämtad';

    //Getting a date one week from now, to use for updated reservedUntil if status is 'reserved'
    var today = new Date();
    const oneDayFromNow = new Date(
      today.getTime() + 24 * 60 * 60 * 1000
    ).toISOString();

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
