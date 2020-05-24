import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Headers
import AddProfileScreen from '../screens/addAndEdit/AddProfileScreen';
import { emptyHeader } from './NavHeaders';

//Add screens

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
        component={AddProfileScreen}
        name="AddProfile"
        options={emptyHeader}
      />
    </AuthProfileStackNavigator.Navigator>
  );
};
