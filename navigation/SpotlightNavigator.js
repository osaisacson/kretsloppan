import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Headers

//Tab screens
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/addAndEdit/EditProductScreen';
import EditProfileScreen, {
  screenOptions as editProfileScreenOptions,
} from '../screens/addAndEdit/EditProfileScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/addAndEdit/EditProjectScreen';
import EditProposalScreen, {
  screenOptions as editProposalScreenOptions,
} from '../screens/addAndEdit/EditProposalScreen';
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions,
} from '../screens/details/ProductDetailScreen';
//Details
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen, {
  screenOptions as proposalDetailScreenOptions,
} from '../screens/details/ProposalDetailScreen';
import UserProfile from '../screens/details/UserProfile';
import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';
//Edit screens
import {
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';

const SpotlightStackNavigator = createStackNavigator();

export const SpotlightNavigator = () => {
  return (
    <SpotlightStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SpotlightStackNavigator.Screen
        component={SpotlightProductsScreen}
        name="Ge Igen"
        options={defaultMainPageOptions}
      />
      <SpotlightStackNavigator.Screen
        component={UserSpotlightScreen}
        name="Min Sida"
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        component={UserProductsScreen}
        name="Mitt upplagda återbruk"
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        component={UserProfile}
        name="Användare"
        options={mainPageOptionsWithUser}
      />
      <SpotlightStackNavigator.Screen
        component={EditProfileScreen}
        name="EditProfile"
        options={editProfileScreenOptions}
      />
      {/* Details */}
      <SpotlightStackNavigator.Screen
        component={ProductDetailScreen}
        name="ProductDetail"
        options={productDetailScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        component={ProposalDetailScreen}
        name="ProposalDetail"
        options={proposalDetailScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        component={ProjectDetailScreen}
        name="ProjectDetail"
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <SpotlightStackNavigator.Screen
        component={EditProductScreen}
        name="EditProduct"
        options={editProductScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        component={EditProjectScreen}
        name="EditProject"
        options={editProjectScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        component={EditProposalScreen}
        name="EditProposal"
        options={editProposalScreenOptions}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
