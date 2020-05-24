import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Headers

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
import { defaultNavOptions, defaultMainPageOptions, mainPageOptionsWithUser } from './NavHeaders';

const ProfilesStackNavigator = createStackNavigator();

export const ProfilesNavigator = () => {
  return (
    <ProfilesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfilesStackNavigator.Screen
        component={AllProfilesScreen}
        name="Alla Användare"
        options={defaultMainPageOptions}
      />
      <ProfilesStackNavigator.Screen
        component={UserProfile}
        name="Användare"
        options={mainPageOptionsWithUser}
      />
      <ProfilesStackNavigator.Screen
        component={ProjectDetailScreen}
        name="ProjectDetail"
        options={projectDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        component={ProductDetailScreen}
        name="ProductDetail"
        options={productDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        component={ProposalDetailScreen}
        name="ProposalDetail"
        options={proposalDetailScreenOptions}
      />
    </ProfilesStackNavigator.Navigator>
  );
};
