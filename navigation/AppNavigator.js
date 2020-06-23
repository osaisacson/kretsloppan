import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';

import StartupScreen from '../screens/StartupScreen';
import WalkthroughScreen from '../screens/WalkthroughScreen';
import { AuthNavigator } from './AuthNavigator';
import { ShopNavigator } from './ShopNavigator';

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);
  const currentProfile = useSelector((state) => state.profiles.userProfile);
  const hasWalkedThrough = useSelector((state) => state.profiles.hasWalkedThrough);
  console.log('Calling AppNavigator');
  console.log('isAuth: ', isAuth);
  console.log('didTryAutoLogin: ', didTryAutoLogin);

  console.log('Currently logged in profile: ', currentProfile);
  console.log('hasWalkedThrough: ', hasWalkedThrough);
  return (
    <NavigationContainer>
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
      {isAuth && !hasWalkedThrough && <WalkthroughScreen />}
      {isAuth && hasWalkedThrough && <ShopNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
