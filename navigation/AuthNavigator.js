import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Auth screens
import AuthScreen from '../screens/AuthScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  console.log('Calling AuthNavigator, waiting for user to login/signup.');

  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerTitle: '',
        headerStyle: {
          height: 0,
        },
      }}>
      <AuthStackNavigator.Screen name="Auth" component={AuthScreen} />
    </AuthStackNavigator.Navigator>
  );
};
