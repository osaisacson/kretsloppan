import {
  DELETE_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  SET_CATEGORIES
} from '../actions/categories';
import Category from '../../models/category';

const initialState = {
  categories: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORIES:
      return {
        categories: action.categories
      };
    case CREATE_CATEGORY:
      const newCategory = new Category(
        action.categoryData.id,
        action.categoryData.categoryName,
        action.categoryData.color
      );
      return {
        ...state,
        categories: state.categories.concat(newCategory)
      };
    case UPDATE_CATEGORY:
      const updatedCategory = new Category(
        action.cid,
        action.categoryData.categoryName,
        action.categoryData.color
      );
      const categoryIndex = state.categories.findIndex(
        cat => cat.id === action.cid
      );
      const updatedCategories = [...state.categories];
      updatedCategories[categoryIndex] = updatedCategory;

      return {
        ...state,
        categories: updatedCategories
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          category => category.id !== action.cid
        )
      };
  }
  return state;
};
