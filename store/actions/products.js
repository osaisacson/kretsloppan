import Product from '../../models/product';
import { convertImage } from '../helpers';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const CHANGE_PRODUCT_AGREEMENT = 'CHANGE_PRODUCT_AGREEMENT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export function fetchProducts() {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    console.log('Fetching products...');

    // Perform the API call - fetching all products
    try {
      const response = await fetch('https://egnahemsfabriken.firebaseio.com/products.json');
      const resData = await response.json();

      const loadedProducts = [];

      for (const key in resData) {
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
            resData[key].background,
            resData[key].length,
            resData[key].height,
            resData[key].width,
            resData[key].price,
            resData[key].priceText,
            resData[key].date,
            resData[key].status,
            resData[key].readyDate,
            resData[key].reservedDate,
            resData[key].reservedUntil,
            resData[key].suggestedDate,
            resData[key].collectingDate,
            resData[key].collectedDate,
            resData[key].projectId,
            resData[key].internalComments,
            resData[key].sellerAgreed,
            resData[key].buyerAgreed
          )
        );
      }
      await dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
      console.log(
        `${loadedProducts.length} products found and loaded. Checking if any of them are reserved...`
      );
      const reservedItems = loadedProducts.filter((prod) => prod.status === 'reserverad');
      if (reservedItems.length) {
        console.log(
          `...${reservedItems.length} reserved products found. Checking if any of them are expired...`
        );

        for (const key in reservedItems) {
          //Is the product reservation expired?
          const reservationExpiryDate = new Date(reservedItems[key].reservedUntil);
          const isPickedUp = reservedItems[key].status === 'hämtad';
          const collectionIsNotAgreed = !reservedItems[key].collectingDate;
          const shouldBeReset =
            !isPickedUp &&
            collectionIsNotAgreed &&
            reservationExpiryDate instanceof Date &&
            reservationExpiryDate <= new Date();

          //If the product has expired, call a function which passes correct new fields and then push the updated product to the reservedItems array
          if (shouldBeReset) {
            console.log('...found expired product, calling unReserveProduct to update it. ------>');
            dispatch(unReserveProduct(key));
            console.log(`${reservedItems[key].id} product was expired, but is now updated.`);
          } else {
            console.log(
              `...${reservedItems[key].id} still has a valid reservation date, and stays reserved.`
            );
          }
          console.log(`...${reservedItems.length} products checked.`);
        }
      } else {
        console.log(
          `...${reservedItems.length} reserved products found. Moving on with our lives.`
        );
      }
    } catch (error) {
      console.log('Error in actions/products/fetchProducts: ', error);
      throw error;
    }
  };
}

export function unReserveProduct(id) {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

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

      console.log('New fields to update expired product with: ', updatedProduct);

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
          sellerAgreed: updatedData.sellerAgreed,
          buyerAgreed: updatedData.buyerAgreed,
        },
      });
      console.log('product updated to: ', updatedData);
    } catch (error) {
      console.log('Error in actions/products/unReserveProduct: ', error);
      throw error;
    }
  };
}

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    try {
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/products/${productId}.json?auth=${token}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        const message = errorId;
        throw new Error(message);
      }
      dispatch({ type: DELETE_PRODUCT, pid: productId });
    } catch (error) {
      console.log('Error in actions/products/deleteProduct: ', error);
      throw error;
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
  image,
  address,
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
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

    try {
      console.log('Creating product...');

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
        background,
        length,
        height,
        width,
        price,
        priceText,
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
        sellerAgreed: '',
        buyerAgreed: '',
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
          background,
          length,
          height,
          width,
          price,
          priceText,
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
          sellerAgreed: '',
          buyerAgreed: '',
        },
      });
      console.log('...product created!');
    } catch (error) {
      console.log('Error in actions/products/createProduct: ', error);
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
  background,
  length,
  height,
  width,
  price,
  priceText,
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
      background,
      length,
      height,
      width,
      price,
      priceText,
      internalComments,
    };

    try {
      console.log('Attempting to update product with data: ', dataToUpdate);

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
          background,
          length,
          height,
          width,
          price,
          priceText,
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

      console.log('returnedProductData from updating product, after patch', returnedProductData);

      console.log('dispatching UPDATE_PRODUCT');

      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: dataToUpdate,
      });
      console.log('...product updated!');
    } catch (error) {
      console.log('Error in actions/products/updateProduct: ', error);
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
    const oneDayFromNow = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString();

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

      await fetch(`https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDataToUpdate),
      });

      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: id,
        productData: productDataToUpdate,
      });
      console.log('Product status changed!');
    } catch (error) {
      console.log('Error in actions/products/changeProductStatus: ', error);
      throw error;
    }
  };
};

export const changeProductAgreement = (id, sellerAgreed, buyerAgreed) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
      console.log('Attempting to change product agreement:');
      console.log('sellerAgreed:', sellerAgreed);
      console.log('buyerAgreed: ', buyerAgreed);

      await fetch(`https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerAgreed,
          buyerAgreed,
        }),
      });

      dispatch({
        type: CHANGE_PRODUCT_AGREEMENT,
        pid: id,
        productData: {
          sellerAgreed,
          buyerAgreed,
        },
      });
      console.log('Product agreement changed!');
    } catch (error) {
      console.log('Error in actions/products/changeProductAgreement: ', error);
      throw error;
    }
  };
};
