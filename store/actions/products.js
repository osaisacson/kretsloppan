import Product from '../../models/product';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_PRODUCTS = 'SET_PRODUCTS';

//reach out to firebase, fetch products and set these in our store
export const fetchProducts = () => {
  return async dispatch => {
    //any async code you want. will now not break the redux flow, because of ReduxThunk
    //...lets us make http requests. gets, posts, puts etc
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/products.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong in ...actions/products.js');
      }

      const resData = await response.json(); //Gives you the data returned by firebase when fetching our products
      const loadedProducts = [];

      //turn returned data into an array by looping over it and returning a new Product
      for (const key in resData) {
        loadedProducts.push(
          //loop over all items in resData

          new Product(
            key,
            'u1',
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price,
            resData[key].categoryName
          )
        );
      }
      console.log(
        '...actions/products.js/fetchProducts: fetching products, raw: ',
        resData
      );
      console.log(
        '...actions/products.js/fetchProducts: fetching products, made to array: ',
        loadedProducts
      );
      dispatch({ type: SET_PRODUCTS, products: loadedProducts }); //pass into our reducer (and store) the new array of loadedProducts we created from the returned data above
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteProduct = productId => {
  return { type: DELETE_PRODUCT, pid: productId };
};

//Returns a promise
export const createProduct = (
  title,
  description,
  imageUrl,
  price,
  categoryName
) => {
  //Dispatched this ways so it gets called by ReduxThunk
  return async dispatch => {
    //any async code you want. will now not break the redux flow, because of ReduxThunk
    //...lets us make http requests. gets, posts, puts etc
    const response = await fetch(
      'https://egnahemsfabriken.firebaseio.com/products.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          categoryName
        })
      }
    );

    const resData = await response.json(); //Gives you the data returned by firebase when creating a product

    console.log(
      '...actions/products.js/createProduct: created product: ',
      resData
    );

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name, //forward to our reducer the id (name ) created by firebase in the above POST
        title, //short syntax when properties have same name. same as title: title.
        description,
        imageUrl,
        price,
        categoryName
      }
    });
  };
};

export const updateProduct = (
  id,
  title,
  description,
  imageUrl,
  categoryName
) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title,
      description,
      imageUrl,
      categoryName
    }
  };
};

export const setCategories = filterSettings => {
  return {
    type: SET_CATEGORIES,
    filters: filterSettings
  };
};
