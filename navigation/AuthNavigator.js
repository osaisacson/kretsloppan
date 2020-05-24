import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Auth screens
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/user/AuthScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}>
      <AuthStackNavigator.Screen component={AuthScreen} name="Auth" options={authScreenOptions} />
    </AuthStackNavigator.Navigator>
  );
};
