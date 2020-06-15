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
  const hasWalkedThrough = useSelector((state) => state.profiles.hasWalkedThrough);
  console.log('hasWalkedThrough: ', hasWalkedThrough);
  return (
    <NavigationContainer>
      {isAuth && !hasWalkedThrough && <WalkthroughScreen />}
      {isAuth && hasWalkedThrough && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
