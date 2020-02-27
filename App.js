import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font'; //Lets us use expo fonts
import ReduxThunk from 'redux-thunk';

//Reducers
import productsReducer from './store/reducers/products';
import projectsReducer from './store/reducers/projects';
import usersReducer from './store/reducers/users';
import authReducer from './store/reducers/auth';

import AppNavigator from './navigation/AppNavigator';

//Combines all the reducers which manages our redux state. This is where we geet our current state from in the child screens.
const rootReducer = combineReducers({
  products: productsReducer,
  projects: projectsReducer,
  users: usersReducer,
  auth: authReducer
});

//NOTE: remove composeWithDevTools before deploying the app. It is only used for React Native Debugger.
// const store = createStore(rootReducer, composeWithDevTools());

const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); //Redux, manages our state.

//Sets up requiring and asynchronically fetching our fonts when the app loads
const fetchFonts = () => {
  return Font.loadAsync({
    'bebas-neue': require('./assets/fonts/BebasNeue-Regular.ttf'),
    'bebas-neue-bold': require('./assets/fonts/BebasNeue-Bold.ttf'),
    'bebas-neue-book': require('./assets/fonts/BebasNeue-Book.ttf'),
    'bebas-neue-light': require('./assets/fonts/BebasNeue-Light.ttf'),
    'bebas-neue-thin': require('./assets/fonts/BebasNeue-Thin.ttf'),
    'roboto-regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
    'roboto-bold-italic': require('./assets/fonts/Roboto-BoldItalic.ttf'),
    'roboto-medium': require('./assets/fonts/Roboto-Medium.ttf'),
    'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
    'roboto-light-italic': require('./assets/fonts/Roboto-LightItalic.ttf'),
    'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  //If font is not loaded yet (fontLoaded is false) return the AppLoading component which pauses the showing of the app until x has been met
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
