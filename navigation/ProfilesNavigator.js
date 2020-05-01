import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Headers
import {
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsWithUser,
} from './NavHeaders';

//Details
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions,
} from '../screens/details/ProductDetailScreen';
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen, {
  screenOptions as proposalDetailScreenOptions,
} from '../screens/details/ProposalDetailScreen';
import UserProfile from '../screens/details/UserProfile';

//Add screens
import AllProfilesScreen from '../screens/shop/AllProfilesScreen';

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
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
    </ProfilesStackNavigator.Navigator>
  );
};
