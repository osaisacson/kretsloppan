import I18n from 'ex-react-native-i18n';
import { AppLoading, Notifications } from 'expo';
import * as Font from 'expo-font'; //Lets us use expo fonts
import * as firebase from 'firebase';
import React, { useState } from 'react';
import { Vibration } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
// Before rendering any navigation stack

import 'firebase/database';
import env from './env';
//Reducers
import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/reducers/auth';
import productsReducer from './store/reducers/products';
import profilesReducer from './store/reducers/profiles';
import projectsReducer from './store/reducers/projects';
import proposalsReducer from './store/reducers/proposals';

//Combines all the reducers which manages our redux state. This is where we geet our current state from in the child screens.
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
//NOTE: remove composeWithDevTools before deploying the app. It is only used for React Native Debugger.
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

// const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); //Redux, manages our state.

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
    'roboto-thin': require('./assets/fonts/Roboto-Thin.ttf'),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  //Prep for setting up notifications
  // useEffect(async () => {
  //   // get expo push token
  //   const token = await Expo.Notifications.getExpoPushTokenAsync();

  //   fetch('https://exp.host/--/api/v2/push/send', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'accept-encoding': 'gzip, deflate',
  //       host: 'exp.host'
  //     },
  //     body: JSON.stringify({
  //       to: token,
  //       title: 'New Notification',
  //       body: 'The notification worked!',
  //       priority: 'high',
  //       sound: 'default',
  //       channelId: 'default'
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(responseJson => {})
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);

  //If font is not loaded yet (fontLoaded is false) return the AppLoading component which pauses the showing of the app until x has been met
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          enableScreens(); //optimise navigation
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
