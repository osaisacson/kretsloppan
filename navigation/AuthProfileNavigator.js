import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AddProfileScreen from '../screens/addAndEdit/AddProfileScreen';
import { emptyHeader } from './NavHeaders';

const AuthProfileStackNavigator = createStackNavigator();

export const AuthProfileNavigator = () => {
  return (
    <AuthProfileStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}>
      <AuthProfileStackNavigator.Screen
        name="AddProfile"
        component={AddProfileScreen}
        options={emptyHeader}
      />
    </AuthProfileStackNavigator.Navigator>
  );
};
