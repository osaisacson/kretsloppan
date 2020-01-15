import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

//reach out to firebase, fetch products and set these in our store
export const fetchProducts = () => {
  //Dispatched this ways so it gets called by ReduxThunk

  return async dispatch => {
    //any async code you want. will now not break the redux flow, because of ReduxThunk
    //...lets us make http requests. gets, posts, puts etc
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedProducts = [];

      //turn returned data into an array by looping over it and returning a new Product
      for (const key in resData) {
        //loop over all items in resData
        loadedProducts.push(
          new Product(
            key,
            'u1',
            resData[key].categoryName,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      console.log(
        '...actions/Products.js/fetchProducts: fetching Products, raw: ',
        resData
      );
      console.log(
        '...actions/Products.js/fetchProducts: fetching Products, made to array: ',
        loadedProducts
      );

      //pass into our reducer (and store) the new array of loadedProducts we created from the returned data above
      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return async dispatch => {
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${productId}.json`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (
  categoryName,
  title,
  description,
  imageUrl,
  price
) => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(
      'https://egnahemsfabriken.firebaseio.com/products.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          title, //short syntax when properties have same name. same as title: title.
          description,
          imageUrl,
          price
        })
      }
    );

    const resData = await response.json(); //Gives you the data returned by firebase when creating a product

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name, //forward to our reducer the id (name ) created by firebase in the above POST
        categoryName,
        title,
        description,
        imageUrl,
        price
      }
    });
  };
};

export const updateProduct = (
  id,
  categoryName,
  title,
  description,
  imageUrl
) => {
  return async dispatch => {
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/products/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        categoryName,
        title,
        description,
        imageUrl
      }
    });
  };
};
