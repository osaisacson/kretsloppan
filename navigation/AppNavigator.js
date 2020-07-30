import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useSelector } from 'react-redux';

import StartupScreen from '../screens/StartupScreen';
import { AuthNavigator } from './AuthNavigator';
import { ShopNavigator } from './ShopNavigator';

const AppNavigator = () => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  console.log('Calling AppNavigator');
  console.log(
    `${
      !isAuth && didTryAutoLogin
        ? "We don't have an auth token and we tried to auto login - should call the AuthNavigator"
        : !isAuth && !didTryAutoLogin
        ? "We don't have an auth token and we did not try to auto login - should call StartupScreen"
        : isAuth
        ? 'We have an auth token - should call the ShopNavigator'
        : null
    }  `
  );

  return (
    <NavigationContainer>
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
      {isAuth && <ShopNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
