import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Headers
import { emptyHeader } from './NavHeaders';

//Add screens
import AddProfileScreen from '../screens/addAndEdit/AddProfileScreen';

const AuthProfileStackNavigator = createStackNavigator();

export const AuthProfileNavigator = () => {
  return (
    <AuthProfileStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}
    >
      <AuthProfileStackNavigator.Screen
        name="AddProfile"
        component={AddProfileScreen}
        options={emptyHeader}
      />
    </AuthProfileStackNavigator.Navigator>
  );
};
