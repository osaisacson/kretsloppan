import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

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
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen, {
  screenOptions as proposalDetailScreenOptions,
} from '../screens/details/ProposalDetailScreen';
import UserProfile from '../screens/details/UserProfile';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';
import ProposalsScreen from '../screens/shop/ProposalsScreen';
import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import UserProposalsScreen from '../screens/user/UserProposalsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';
import {
  defaultNavOptions,
  defaultMainPageOptions,
  defaultDetailOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';

const SpotlightStackNavigator = createStackNavigator();

export const SpotlightNavigator = () => {
  return (
    <SpotlightStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SpotlightStackNavigator.Screen
        name="Kretsloppan"
        component={SpotlightProductsScreen}
        options={defaultMainPageOptions}
      />
      <SpotlightStackNavigator.Screen
        name="Återbruk"
        component={ProductsScreen}
        options={productDetailScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        name="Projekt"
        component={ProjectsScreen}
        options={projectDetailScreenOptions}
      />
      <SpotlightStackNavigator.Screen
        name="Efterlysningar"
        component={ProposalsScreen}
        options={proposalDetailScreenOptions}
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
      <SpotlightStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <SpotlightStackNavigator.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={editProfileScreenOptions}
      />
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
        name="Alla mina efterlysningar"
        component={UserProposalsScreen}
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        name="Användare"
        component={UserProfile}
        options={mainPageOptionsWithUser}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
