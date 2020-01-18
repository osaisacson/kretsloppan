import Category from '../../models/category';

export const DELETE_CATEGORY = 'DELETE_CATEGORY';
export const CREATE_CATEGORY = 'CREATE_CATEGORY';
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY';
export const SET_CATEGORIES = 'SET_CATEGORIES';

export const fetchCategories = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://egnahemsfabriken.firebaseio.com/categories.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedCategories = [];

      for (const key in resData) {
        loadedCategories.push(
          new Category(key, resData[key].categoryName, resData[key].color)
        );
      }

      dispatch({
        type: SET_CATEGORIES,
        categories: loadedCategories
      });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteCategory = categoryId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/categories/${categoryId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_CATEGORY, cid: categoryId });
  };
};

export const createCategory = (categoryName, color) => {
  return async (dispatch, getState) => {
    // any async code you want!
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/categories.json?auth=${token}`,
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

    const resData = await response.json();

    dispatch({
      type: CREATE_CATEGORY,
      categoryData: {
        id: resData.name,
        categoryName,
        color
      }
    });
  };
};

export const updateCategory = (categoryId, categoryName, color) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://egnahemsfabriken.firebaseio.com/categories/${categoryId}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoryName,
          color
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_CATEGORY,
      cid: categoryId,
      categoryData: {
        categoryName,
        color
      }
    });
  };
};
