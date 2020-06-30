import { StackActions, useNavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import usePopToTopOnBlur from '../hooks/usePopToTopOnBlur';
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
import UserProductsScreen from '../screens/user/UserProductsScreen';
import UserProposalsScreen from '../screens/user/UserProposalsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';
import {
  detailHeader,
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsWithUser,
  mainPageOptionsNoUser,
} from './NavHeaders';

const SpotlightStackNavigator = createStackNavigator();

export const SpotlightNavigator = ({ navigation }) => {
  usePopToTopOnBlur(navigation, 'Kretsloppan');

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
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
      {/* User product screens  */}
      <SpotlightStackNavigator.Screen
        name="Mitt upplagda återbruk"
        component={UserProductsScreen}
        options={mainPageOptionsNoUser}
      />
      {/* User project screens  */}
      {/* User proposal screens  */}
      <SpotlightStackNavigator.Screen
        name="Alla mina efterlysningar"
        component={UserProposalsScreen}
        options={mainPageOptionsNoUser}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
