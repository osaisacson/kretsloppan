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
      const updatedData = response.json();
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

// export const fetchProducts = () => {
//   return async (dispatch, getState) => {
//     const userId = getState().auth.userId;

//     try {
//       console.log('actions/products.js fetchProducts: setting loading to true');
//       dispatch({
//         type: LOADING_BEGIN,
//       });
//       const response = await fetch(
//         'https://egnahemsfabriken.firebaseio.com/products.json'
//       );

//       if (!response.ok) {
//         const errorResData = await response.json();
//         const errorId = errorResData.error.message;
//         let message = errorId;
//         throw new Error(message);
//       }

//       const resData = await response.json();
//       const loadedProducts = [];

//       for (const key in resData) {
//         //Set the expiry date to be the date which the product has been reserved until
//         const reservationExpiryDate = new Date(resData[key].reservedUntil);
//         //Check if the product has been picked up or not
//         const isPickedUp = resData[key].status === 'hämtad';
//         //Set default values
//         let ownerId = resData[key].ownerId;
//         let reservedUserId = resData[key].reservedUserId;
//         let newOwnerId = resData[key].newOwnerId;
//         let categoryName = resData[key].categoryName;
//         let condition = resData[key].condition;
//         let title = resData[key].title;
//         let image = resData[key].image;
//         let address = resData[key].address;
//         let phone = resData[key].phone;
//         let description = resData[key].description;
//         let price = resData[key].price;
//         let date = resData[key].date;
//         let status = resData[key].status;
//         let readyDate = resData[key].readyDate;
//         let pauseDate = resData[key].pauseDate;
//         let reservedDate = resData[key].reservedDate;
//         let reservedUntil = resData[key].reservedUntil;
//         let collectedDate = resData[key].collectedDate;
//         let projectId = resData[key].projectId;

//         //If the product is not picked up, reservationExpiryDate is a date, and that date is less than today...
//         if (
//           !isPickedUp &&
//           reservationExpiryDate instanceof Date &&
//           reservationExpiryDate <= new Date()
//         ) {
//           const token = getState().auth.token;

//           //...set the default values to be these instead:
//           reservedUserId = '';
//           newOwnerId = '';
//           status = 'redo';
//           pauseDate = '';
//           readyDate = new Date().toISOString(); //Current date
//           reservedDate = '';
//           reservedUntil = '';
//           collectedDate = '';
//           projectId = '';

//           //Checks
//           // console.log('------------EXPIRED------------');
//           // console.log('title:', title);
//           // console.log('reservationExpiryDate:', reservationExpiryDate);
//           // console.log('thats a date?:', reservationExpiryDate instanceof Date);
//           // console.log('original status:', resData[key].status);
//           // console.log('new status:', status);
//           // console.log('reset project id as empty string: ', projectId);
//           // console.log('original reservedUntil:', resData[key].reservedUntil);
//           // console.log('sets new reservedUntil as empty string:', reservedUntil);
//           // console.log('original reservedUserId:', resData[key].reservedUserId);
//           // console.log(
//           //   'sets new reservedUserId as empty string:',
//           //   reservedUserId
//           // );
//           // console.log('original reservedDate:', resData[key].reservedDate);
//           // console.log('sets new reservedDate as empty string: ', reservedDate);
//           // console.log('--------------------------------------');

//           const response = await fetch(
//             `https://egnahemsfabriken.firebaseio.com/products/${key}.json?auth=${token}`,
//             {
//               method: 'PATCH',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 reservedUserId,
//                 newOwnerId,
//                 status,
//                 pauseDate,
//                 readyDate,
//                 reservedDate,
//                 reservedUntil,
//                 collectedDate,
//                 projectId,
//               }),
//             }
//           );

//           if (!response.ok) {
//             console.log(
//               'actions/products.js fetchProducts: Something went wrong in attempting to update expired products'
//             );
//             const errorResData = await response.json();
//             const errorId = errorResData.error.message;
//             let message = errorId;
//             throw new Error(message);
//           }

//           dispatch({
//             type: CHANGE_PRODUCT_STATUS,
//             pid: key,
//             productData: {
//               reservedUserId,
//               newOwnerId,
//               status,
//               pauseDate,
//               readyDate,
//               reservedDate,
//               reservedUntil,
//               collectedDate,
//               projectId,
//             },
//           });
//         }
//         dispatch({
//           type: LOADING_BEGIN,
//         });
//         console.log(
//           'actions/products.js fetchProducts: setting loading to true again, after having dispatched CHANGE_PRODUCT_STATUS, which if successful sets it to false. This is because we need to now update the full set of products.'
//         );

//         loadedProducts.push(
//           new Product(
//             key,
//             ownerId,
//             reservedUserId,
//             newOwnerId,
//             categoryName,
//             condition,
//             title,
//             image,
//             address,
//             phone,
//             description,
//             price,
//             date,
//             status,
//             pauseDate,
//             readyDate,
//             reservedDate,
//             reservedUntil,
//             collectedDate,
//             projectId
//           )
//         );
//       }
//       console.log('store/actions/proposals/fetchProducts: fetching products');

//       dispatch({
//         type: SET_PRODUCTS,
//         products: loadedProducts,
//         userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
//         reservedProducts: loadedProducts.filter(
//           (prod) =>
//             prod.status === 'reserverad' && prod.reservedUserId === userId
//         ),
//       });
//     } catch (err) {
//       // send to custom analytics server
//       throw err;
//     }
//   };
// };

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

export const createProduct = (
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
    const userId = getState().auth.userId;
    const currentDate = new Date().toISOString();

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
          ownerId: userId,
          reservedUserId: '',
          newOwnerId: '',
          categoryName,
          condition,
          title,
          image: parsedRes.image, //This is how we link to the image we store above
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
        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/products.json?auth=${token}`,
          {
            method: 'POST',
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
            console.log('store/actions/products/createProduct called');

            dispatch({
              type: CREATE_PRODUCT,
              productData: {
                id: finalResParsed.name,
                ownerId: userId,
                reservedUserId: '',
                newOwnerId: '',
                categoryName,
                condition,
                title,
                image,
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
          });
      })
      .catch((err) =>
        console.log('error when trying to post to cloudfunctions', err)
      );
  };
};

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
