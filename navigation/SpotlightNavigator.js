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
import ProductDetailScreen from '../screens/details/ProductDetailScreen';
import ProjectDetailScreen from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen from '../screens/details/ProposalDetailScreen';
import UserProfile from '../screens/details/UserProfile';
import ProductsScreen from '../screens/shop/ProductsScreen';
import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
import MyProfileStack from './MyProfileStack';
import {
  detailHeader,
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsWithUser,
  mainPageOptionsNoUser,
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
      <SpotlightStackNavigator.Screen name="Återbruk" component={ProductsScreen} />
      {/* Details */}
      <SpotlightStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={detailHeader}
      />
      <SpotlightStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={detailHeader}
      />
      <SpotlightStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={detailHeader}
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
        name="Användare"
        component={UserProfile}
        options={mainPageOptionsWithUser}
      />
      <SpotlightStackNavigator.Screen
        name="Min Sida"
        component={MyProfileStack}
        options={mainPageOptionsNoUser}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
