import Product from '../../models/product';

export const LOADING_BEGIN = 'LOADING_BEGIN';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'CHANGE_PRODUCT_STATUS';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export function updateReservedProduct(key, product, token) {
  return async (dispatch) => {
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log(
        'START----------actions/products/updateReservedProduct--------'
      );
      console.log('key: ', key);
      console.log('unchanged product: ', product);
      console.log('token: ', token);

      //Since the products reservation date has passed, reset these values:
      product.reservedUserId = '';
      product.newOwnerId = '';
      product.status = 'redo';
      product.pauseDate = '';
      product.readyDate = new Date().toISOString(); //Current date
      product.eservedDate = '';
      product.reservedUntil = '';
      product.collectedDate = '';
      product.projectId = '';

      console.log('product values after update, to be sent to API: ', product);

      // Perform the API call - update the product that has been expired
      const response = await fetch(
        `https://egnahemsfabriken.firebaseio.com/products/${key}.json?auth=${token}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reservedUserId: product.reservedUserId,
            newOwnerId: product.newOwnerId,
            status: product.status,
            pauseDate: product.pauseDate,
            readyDate: product.readyDate,
            reservedDate: product.reservedDate,
            reservedUntil: product.reservedUntil,
            collectedDate: product.collectedDate,
            projectId: product.projectId,
          }),
        }
      );
      const updatedData = await response.json();
      console.log(
        'actions/products/updateReservedProduct returned updated data after API call',
        updatedData
      );
      dispatch({
        type: CHANGE_PRODUCT_STATUS,
        pid: key,
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
      console.log('ERROR: ', error);
      console.log('Error when updating products, setting is loading to false');
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
    console.log(
      'Starting to fetch/update products, setting is loading to true'
    );
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    ('START----------actions/products/fetchProducts--------');

    // Perform the API call - fetching all products
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );
      const resData = await response.json();
      console.log(
        'Fetched data from API, length: ',
        resData && resData.length
          ? resData.length
          : 'resData && resData.length evaluated to false'
      );
      const loadedProducts = [];
      console.log(
        'Checking if any of the product reservation dates has passed'
      );
      for (const key in resData) {
        //Is the product reservation expired?
        const reservationExpiryDate = new Date(resData[key].reservedUntil);
        const isPickedUp = resData[key].status === 'hämtad';
        const shouldBeReset =
          !isPickedUp &&
          reservationExpiryDate instanceof Date &&
          reservationExpiryDate <= new Date();
        console.log('Is it expired? ', shouldBeReset);
        //If it is not picked up and the reservation has passed...
        if (shouldBeReset) {
          const token = getState().auth.token;
          //...call the function which updates the product data, and pass it the product and auth token
          console.log(
            'Found expired product, calling updateReservedProduct ------>'
          );
          return updateReservedProduct(key, resData[key], token).then(
            (updatedResult) => {
              console.log(
                '---------> ...updated result received from updateReservedProduct, updating product with: '
              );
              console.log('key: ', key);
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
          );
        }
        console.log(
          `${key} product was not expired, pushing original product to loadedProducts`
        );
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
        reservedProducts: loadedProducts.filter(
          (prod) =>
            prod.status === 'reserverad' && prod.reservedUserId === userId
        ),
      });
      console.log(
        'Done with fetching/updating products, setting is loading to false'
      );
      // Set a loading flag to false in the reducer
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/fetchProducts--------END');
    } catch (error) {
      console.log('ERROR: ', error);
      console.log(
        'Error when fetching/updating products, setting is loading to false'
      );
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

export function createImage(image) {
  return async (dispatch) => {
    // Set a loading flag to true in the reducer
    dispatch({ type: 'LOADING', loading: true });
    try {
      console.log('START----------actions/products/createImage--------');
      console.log('Attempting to convert image from base64 to firebase url');
      console.log('image.length: ', image.length);

      // Perform the API call - convert image from base64 to a firebase url
      const response = await fetch(
        'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
        {
          method: 'POST',
          body: JSON.stringify({
            image: image, //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
          }),
        }
      );

      const firebaseImageUrl = await response.json();
      console.log('returned image url from firebase', firebaseImageUrl);
      console.log('----------actions/products/createImage--------END');
      return firebaseImageUrl;
    } catch (error) {
      console.log('ERROR: ', error);
      console.log('Error when updating products, setting is loading to false');
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/updateReservedProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

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
      return dispatch(createImage(image)).then(
        async (parsedRes) => {
          //...then take the returned image and...
          console.log(
            'returned result from the createImage function: ',
            parsedRes
          );

          //...together with the rest of the data create the productData object.
          const productData = {
            ownerId: userId,
            reservedUserId: '',
            newOwnerId: '',
            categoryName,
            condition,
            title,
            image: parsedRes.image, //This is how we link to the image we create through the createImage function
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
              image: parsedRes.image,
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
        },
        (error) => {
          dispatch({ type: 'LOADING', loading: false });
          console.log(
            'Error when creating product, setting is loading to false'
          );
          throw error;
        }
      );
    } catch (error) {
      console.log('ERROR: ', error);
      console.log('Error when creating product, setting is loading to false');
      dispatch({ type: 'LOADING', loading: false });
      ('----------actions/products/createProduct--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}

// export const createProduct = (
//   categoryName,
//   condition,
//   title,
//   image,
//   address,
//   phone,
//   description,
//   price
// ) => {
//   return (dispatch, getState) => {
//     const token = getState().auth.token;
//     const userId = getState().auth.userId;
//     const currentDate = new Date().toISOString();

//     ('START----------actions/products/createProduct--------');
//     console.log('Set loading to true');
//     dispatch({ type: 'LOADING', loading: true });

//     //First convert the base64 image to a firebase url...
//     return createImage(image)
//       .then((parsedRes) => {
//         //...then take the returned image and...
//         console.log(
//           'returned result from the createImage function: ',
//           parsedRes
//         );
//         //...together with the rest of the data create the productData object.
//         const productData = {
//           ownerId: userId,
//           reservedUserId: '',
//           newOwnerId: '',
//           categoryName,
//           condition,
//           title,
//           image: parsedRes.image, //This is how we link to the image we create through the createImage function
//           address,
//           phone,
//           description,
//           price,
//           date: currentDate,
//           status: 'redo',
//           pauseDate: '',
//           readyDate: currentDate,
//           reservedDate: '',
//           reservedUntil: '',
//           collectedDate: '',
//           projectId: '000',
//         };
//         //Then post our projectData object to the realtime database on firebase
//         return fetch(
//           `https://egnahemsfabriken.firebaseio.com/products.json?auth=${token}`,
//           {
//             method: 'POST',
//             body: JSON.stringify(productData),
//           }
//         )
//           .then((finalRes) => finalRes.json())
//           .then((finalResParsed) => {
//             console.log(
//               'returned data from firebase after post of productData',
//               finalResParsed
//             );
//             console.log('dispatching CREATE_PRODUCT');

//             dispatch({
//               type: CREATE_PRODUCT,
//               productData: {
//                 id: finalResParsed.name,
//                 ownerId: userId,
//                 reservedUserId: '',
//                 newOwnerId: '',
//                 categoryName,
//                 condition,
//                 title,
//                 image,
//                 address,
//                 phone,
//                 description,
//                 price,
//                 date: currentDate,
//                 status: 'redo',
//                 readyDate: currentDate,
//                 pauseDate: '',
//                 readyDate: currentDate,
//                 reservedDate: '',
//                 reservedUntil: '',
//                 collectedDate: '',
//                 projectId: '000',
//               },
//             }),
//               (error) => {
//                 console.log(
//                   'ERROR when trying to dispatch CREATE_PRODUCT: ',
//                   error
//                 );
//                 throw error;
//               };
//           });
//       })
//       .catch((err) =>
//         console.log('ERROR when trying to create product: ', err)
//       );
//   };
// };

export const updateProduct = (
  id,
  categoryName,
  condition,
  title,
  image,
  address,
  phone,
  description,
  price
) => {
  return (dispatch, getState) => {
    const token = getState().auth.token;

    // Handle HTTP errors since fetch won't.
    function handleErrors(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }

    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image, //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        }),
      }
    )
      .then(handleErrors)
      .then((res) => res.json())
      .then((parsedRes) => {
        const productData = {
          categoryName,
          condition,
          title,
          image: parsedRes.image, //This is how we link to the image we store above
          address,
          phone,
          description,
          price,
        };
        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
          {
            method: 'PATCH',
            body: JSON.stringify(productData),
          }
        )
          .catch((err) =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then((finalRes) => finalRes.json())
          .then((finalResParsed) => {
            dispatch({
              type: UPDATE_PRODUCT,
              pid: id,
              productData: {
                categoryName,
                condition,
                title,
                image,
                address,
                phone,
                description,
                price,
              },
            });
          });
      })
      .catch((err) =>
        console.log('error when trying to post to cloudfunctions', err)
      );
  };
};

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

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservedUserId: updatedReservedUserId,
          newOwnerId: updatedNewOwnerId,
          status,
          pauseDate: updatedPauseDate,
          readyDate: updatedReadyDate,
          reservedDate: updatedReservedDate,
          reservedUntil: updatedReservedUntil,
          collectedDate: updatedCollectedDate,
          projectId: updatedProjectId,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: CHANGE_PRODUCT_STATUS,
      pid: id,
      productData: {
        reservedUserId: updatedReservedUserId,
        newOwnerId: updatedNewOwnerId,
        status,
        pauseDate: updatedPauseDate,
        readyDate: updatedReadyDate,
        reservedDate: updatedReservedDate,
        reservedUntil: updatedReservedUntil,
        collectedDate: updatedCollectedDate,
        projectId: updatedProjectId,
      },
    });
  };
};
