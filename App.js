import I18n from 'ex-react-native-i18n';
import { AppLoading, Notifications } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as firebase from 'firebase';
import React, { useState, useEffect } from 'react';
import { Vibration } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider, useDispatch } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import 'firebase/database';
import env from './env';
import AppNavigator from './navigation/AppNavigator';
import * as productsActions from './store/actions/products';
import * as profilesActions from './store/actions/profiles';
import * as projectsActions from './store/actions/projects';
import * as proposalsActions from './store/actions/proposals';
import checkExpiredToken from './store/middlewares/checkExpiredToken';
import authReducer from './store/reducers/auth';
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
  auth: authReducer,
});

I18n.default_locale = 'sv-SE';

if (!firebase.apps.length) {
  firebase.initializeApp(env.firebaseConfig);
}

Notifications.addListener(() => Vibration.vibrate());

const AppWrapper = () => {
  console.log('Calling AppWrapper, creating store and provider.');
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
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;

    if (dataLoaded) {
      dispatch(profilesActions.setCurrentProfile(currentUser ? currentUser.toJSON() : {}));
      setIsAuthLoaded(true);
    }
  }, [dataLoaded]);

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
        dispatch(profilesActions.fetchProfiles()),
        dispatch(productsActions.fetchProducts()),
        dispatch(projectsActions.fetchProjects()),
        dispatch(proposalsActions.fetchProposals()),
      ]);
      return allPromises;
    } catch (error) {
      console.log('Error in attempting to load all resources, App.js', error);
    } finally {
      console.log('.........all resources loaded from App.js!');
    }
  };

  //If data is not loaded yet return the AppLoading component which pauses the showing of the app until x has been met
  if (!dataLoaded || !isAuthLoaded) {
    console.log('Waiting for font and data to be loaded...');
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onFinish={() => {
          setDataLoaded(true);
          enableScreens(); //optimise navigation
          console.log(
            '.........loaded all resources successfully in App.js, disabling AppLoading and moving on to call AppNavigator.'
          );
        }}
      />
    );
  }
  return <AppNavigator />;
};

export default AppWrapper;
