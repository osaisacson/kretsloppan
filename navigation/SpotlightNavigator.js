import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import usePopToTopOnBlur from '../hooks/usePopToTopOnBlur';
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/EditProductScreen';
import EditProfileScreen, {
  screenOptions as editProfileScreenOptions,
} from '../screens/EditProfileScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/EditProjectScreen';
import EditProposalScreen, {
  screenOptions as editProposalScreenOptions,
} from '../screens/EditProposalScreen';
import ProductDetail from '../screens/ProductDetail';
import ProjectDetail from '../screens/ProjectDetail';
import ProposalDetail from '../screens/ProposalDetail';
import ProductsList from '../screens/ProductsList';
import SpotlightScreen from '../screens/SpotlightScreen';
import UserProductsScreen from '../screens/UserProductsScreen';
import UserProfile from '../screens/UserProfile';
import UserProposalsScreen from '../screens/UserProposalsScreen';
import UserSpotlightScreen from '../screens/UserSpotlightScreen';
import {
  detailHeader,
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';

const SpotlightStackNavigator = createStackNavigator();

export const SpotlightNavigator = ({ navigation }) => {
  usePopToTopOnBlur(navigation, 'Kretsloppan');

  return (
    <SpotlightStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <SpotlightStackNavigator.Screen
        name="Kretsloppan"
        component={SpotlightScreen}
        options={defaultMainPageOptions}
      />
      <SpotlightStackNavigator.Screen name="Återbruk" component={ProductsList} />
      {/* Details */}
      <SpotlightStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={detailHeader}
      />
      <SpotlightStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetail}
        options={detailHeader}
      />
      <SpotlightStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetail}
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
      <SpotlightStackNavigator.Screen
        name="Mitt återbruk"
        component={UserProductsScreen}
        options={mainPageOptionsNoUser}
      />
      <SpotlightStackNavigator.Screen
        name="Alla mina efterlysningar"
        component={UserProposalsScreen}
        options={mainPageOptionsNoUser}
      />
    </SpotlightStackNavigator.Navigator>
  );
};
