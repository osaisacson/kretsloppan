import Category from '../../models/category';

export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const SET_CATEGORIES = 'SET_CATEGORIES';

//reach out to firebase, fetch categories and set these in our store
export const fetchCategories = () => {
  return async dispatch => {
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/categories.json'
      );

      if (!response.ok) {
        throw new Error(
          'Something went wrong in ...actions/categories.js/fetchCategories'
        );
      }

      const resData = await response.json(); //Gives you the data returned by firebase when fetching our Categories
      const loadedCategories = [];

      //turn returned data into an array by looping over it and returning a new Category
      for (const key in resData) {
        loadedCategories.push(
          //loop over all items in resData

          new Category(key, resData[key].categoryName, resData[key].color)
        );
      }
      console.log(
        '...actions/Categories.js/fetchCategories: fetching Categories, raw: ',
        resData
      );
      console.log(
        '...actions/Categories.js/fetchCategories: fetching Categories, made to array: ',
        loadedCategories
      );
      dispatch({ type: SET_CATEGORIES, categories: loadedCategories }); //pass into our reducer (and store) the new array of loadedCategories we created from the returned data above
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

//Create a new category
export const createCategory = (categoryName, color) => {
  //Dispatched this ways so it gets called by ReduxThunk
  return async dispatch => {
    //any async code you want. will now not break the redux flow, because of ReduxThunk
    //...lets us make http requests. gets, posts, puts etc
    const response = await fetch(
      'https://egnahemsfabriken.firebaseio.com/categories.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          color
        })
      }
    );

    const resData = await response.json(); //Gives you the data returned by firebase when creating a product

    console.log(
      '...actions/categories.js/createProduct: created category: ',
      resData
    );

    dispatch({
      type: CREATE_CATEGORY,
      productData: {
        id: resData.name, //forward to our reducer the id (name ) created by firebase in the above POST
        categoryName,
        color
      }
    });
  };
};

export const updateCategory = (id, categoryName, color) => {
  return {
    type: UPDATE_CATEGORY,
    cid: id,
    categoryData: {
      categoryName,
      color
    }
  };
};

export const deleteCategory = categoryId => {
  return { type: DELETE_CATEGORY, cid: categoryId };
};
