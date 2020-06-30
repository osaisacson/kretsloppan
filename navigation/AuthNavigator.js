import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Auth screens
import AuthScreen from '../screens/user/AuthScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}>
      <AuthStackNavigator.Screen name="Auth" component={AuthScreen} options={authScreenOptions} />
    </AuthStackNavigator.Navigator>
  );
};
