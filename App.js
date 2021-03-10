import I18n from 'ex-react-native-i18n';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as Notifications from 'expo-notifications'
import * as firebase from 'firebase';
import React, { useState } from 'react';
import { Vibration } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import 'firebase/database';
import env from './env';
import AppNavigator from './navigation/AppNavigator';
import checkExpiredToken from './store/middlewares/checkExpiredToken';
import authReducer from './store/reducers/auth';
import ordersReducer from './store/reducers/orders';
import productsReducer from './store/reducers/products';
import profilesReducer from './store/reducers/profiles';
import projectsReducer from './store/reducers/projects';
import proposalsReducer from './store/reducers/proposals';

//Combines all the reducers which manages our redux state. This is where we get our current state from in the child screens.
const rootReducer = combineReducers({
  products: productsReducer,
  projects: projectsReducer,
  profiles: profilesReducer,
  proposals: proposalsReducer,
  orders: ordersReducer,
  auth: authReducer,
});

I18n.default_locale = 'sv-SE';

if (!firebase.apps.length) {
  firebase.initializeApp(env.firebaseConfig);
}

//The below broke as part of updating to SDK 40. TODO - Add new listeners according to https://docs.expo.io/versions/latest/sdk/notifications/
//Notifications.addListener(() => Vibration.vibrate());

const AppWrapper = () => {
  console.log('Calling AppWrapper, creating store and provider');
  const store = createStore(rootReducer, applyMiddleware(checkExpiredToken, ReduxThunk));

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App = () => {
  console.log('Calling App');
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadResourcesAsync = async () => {
    try {
      console.log('Initializing data loading.........');
      const allPromises = await Promise.all([
        // Load assets
        Asset.loadAsync([require('./assets/userBackground.png')]),
        // Load fonts
        Font.loadAsync({
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
          'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
        }),
      ]);
      return allPromises;
    } catch (error) {
      console.log('Error in attempting to load all resources, App.js', error);
    } finally {
      console.log('.........all assets and fonts loaded from App.js!');
      console.log('hiding SplashsScreen');
    }
  };

  //If data is not loaded yet return the AppLoading component which pauses the showing of the app until x has been met
  if (!dataLoaded) {
    console.log('Waiting for assets and fonts to be loaded...');
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onFinish={() => {
          setDataLoaded(true);
          enableScreens(); //optimise navigation
        }}
        onError={console.warn}
      />
    );
  }
  return <AppNavigator />;
};

export default AppWrapper;
