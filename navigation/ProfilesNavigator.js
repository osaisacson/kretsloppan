import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ProductDetail, { screenOptions as productDetailOptions } from '../screens/ProductDetail';
import ProjectDetail, { screenOptions as projectDetailOptions } from '../screens/ProjectDetail';
import ProposalDetail, { screenOptions as proposalDetailOptions } from '../screens/ProposalDetail';
import AllProfilesScreen from '../screens/AllProfilesScreen';
import UserProfile from '../screens/UserProfile';
import { defaultNavOptions, defaultMainPageOptions, mainPageOptionsWithUser } from './NavHeaders';

const ProfilesStackNavigator = createStackNavigator();

export const ProfilesNavigator = () => {
  return (
    <ProfilesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfilesStackNavigator.Screen
        name="Alla Användare"
        component={AllProfilesScreen}
        options={defaultMainPageOptions}
      />
      <ProfilesStackNavigator.Screen
        name="Användare"
        component={UserProfile}
        options={mainPageOptionsWithUser}
      />
      <ProfilesStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetail}
        options={projectDetailOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={productDetailOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetail}
        options={proposalDetailOptions}
      />
    </ProfilesStackNavigator.Navigator>
  );
};
