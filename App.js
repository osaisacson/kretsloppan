import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

import productsReducer from './store/reducers/products';
import ShopNavigator from './navigation/ShopNavigator';

//Combines all the reducers which manages our redux state. This is where we geet our current state from in the child screens.
const rootReducer = combineReducers({
  products: productsReducer
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
