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
        name="Ge Igen"
        component={SpotlightProductsScreen}
        options={defaultMainPageOptions}
      />
      <SpotlightStackNavigator.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        name="Mitt upplagda återbruk"
        component={UserProductsScreen}
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        name="Användare"
        component={UserProfile}
        options={mainPageOptionsWithUser}
      />
      <SpotlightStackNavigator.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={editProfileScreenOptions}
      />
      {/* Details */}
      <SpotlightStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
      {/* Edits */}
      <SpotlightStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
