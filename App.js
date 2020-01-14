import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font'; //Lets us use expo fonts
// import { composeWithDevTools } from 'redux-devtools-extension'; //NOTE: remove before deploying the app. It is only used for React Native Debugger.
import ReduxThunk from 'redux-thunk';

import categoryReducer from './store/reducers/categories';
import productsReducer from './store/reducers/products';
import cartReducer from './store/reducers/cart';
import ordersReducer from './store/reducers/orders';

import ShopNavigator from './navigation/ShopNavigator';

//Combines all the reducers which manages our redux state. This is where we geet our current state from in the child screens.
const rootReducer = combineReducers({
  categories: categoryReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer
});

//NOTE: remove composeWithDevTools before deploying the app. It is only used for React Native Debugger.
// const store = createStore(rootReducer, composeWithDevTools());

const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); //Redux, manages our state.

//Sets up requiring and asynchronically fetching our fonts when the app loads
const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  //If font is not loaded yet (fontLoaded is false) return the AppLoading component which pauses the showing of the app until x has been met
  if (!fontLoaded) {
    console.log('App loading, waiting for font to load');
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      ></AppLoading>
    );
  }

  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}
