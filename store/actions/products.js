import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const CHANGE_PRODUCT_STATUS = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = errorId;
        throw new Error(message);
      }

      const resData = await response.json();
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].categoryName,
            resData[key].title,
            resData[key].image,
            resData[key].description,
            resData[key].price,
            resData[key].date,
            resData[key].status
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE'
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
  title,
  description,
  price,
  image,
  status
) => {
  // console.log('---------Actions > products.js > createProduct');
  // console.log('-received original params: ');
  // console.log('categoryName: ', categoryName);
  // console.log('title: ', title);
  // console.log('description: ', description);
  // console.log('price: ', price);
  // console.log(
  //   'image: ',
  //   image && image.length > 100
  //     ? 'passed image base64 as expected'
  //     : 'WARNING: no image base64 passed'
  // );
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const date = new Date();
    // console.log('-set constants: ');
    // console.log('token: ', token);
    // console.log('userId: ', userId);
    // console.log('date: ', date);

    //First upload the base64 image
    fetch(
      'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
      {
        method: 'POST',
        body: JSON.stringify({
          image: image //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
        })
      }
    )
      .catch(err =>
        console.log('error when trying to post to cloudfunctions', err)
      )
      .then(res => res.json())
      .then(parsedRes => {
        // console.log(
        //   'passed parsedRes before doing fetch to firebase realtime database of products: ',
        //   parsedRes
        // );
        const productData = {
          categoryName,
          title,
          description,
          price,
          image: parsedRes.image, //This is how we link to the image we store above
          ownerId: userId,
          date: date.toISOString(),
          status
        };
        // console.log(
        //   'productData we are trying to pass to the realtime database: ',
        //   productData
        // );
        //Then upload the rest of the data to realtime database on firebase
        return fetch(
          `https://egnahemsfabriken.firebaseio.com/products.json?auth=${token}`,
          {
            method: 'POST',
            body: JSON.stringify(productData)
          }
        )
          .catch(err =>
            console.log(
              'Error when attempting to save to firebase realtime database: ',
              err
            )
          )
          .then(finalRes => finalRes.json())
          .then(finalResParsed => {
            // console.log('FINAL RES IS BEING CALLED: ', finalResParsed);
            // console.log(
            //   'finalResParsed from end of createProduct: ',
            //   finalResParsed
            // );
            dispatch({
              type: CREATE_PRODUCT,
              productData: {
                id: finalResParsed.name,
                categoryName,
                title,
                description,
                price,
                image,
                ownerId: userId,
                date: date,
                status
              }
            });
            // console.log('END------------');
          });
      });
  };
};

export const updateProduct = (
  id,
  categoryName,
  title,
  description,
  price,
  image,
  status
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          title,
          description,
          price,
          image,
          status
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = errorId;
      throw new Error(message);
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        categoryName,
        title,
        description,
        price,
        image,
        status
      }
    });
  };
};

export const changeProductStatus = (id, status) => {
  console.log('changing product status to', status);
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status
        })
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
        status
      }
    });
  };
};
