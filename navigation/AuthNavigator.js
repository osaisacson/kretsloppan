import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Auth screens
import AuthScreen, {
  screenOptions as authScreenOptions,
} from '../screens/user/AuthScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}
    >
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
