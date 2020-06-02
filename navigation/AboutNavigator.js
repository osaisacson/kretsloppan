import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import AboutScreen from '../screens/AboutScreen';
import { defaultNavOptions, defaultMainPageOptions } from './NavHeaders';

const AboutStackNavigator = createStackNavigator();

export const AboutNavigator = () => {
  return (
    <AboutStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AboutStackNavigator.Screen
        name="Om oss"
        component={AboutScreen}
        options={defaultMainPageOptions}
      />
    </AboutStackNavigator.Navigator>
  );
};
