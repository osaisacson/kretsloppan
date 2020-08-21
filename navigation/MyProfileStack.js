import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/addAndEdit/EditProductScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/addAndEdit/EditProjectScreen';
import EditProposalScreen, {
  screenOptions as editProposalScreenOptions,
} from '../screens/addAndEdit/EditProposalScreen';
import ProductDetailScreen from '../screens/details/ProductDetail/ProductDetailScreen;
import ProjectDetailScreen from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen from '../screens/details/ProposalDetailScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import UserProposalsScreen from '../screens/user/UserProposalsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';
import { topStackHeaderForTabs, detailHeaderForTabs, mainPageOptionsNoUser } from './NavHeaders';

const DetailsStack = createStackNavigator();

const MyProfileStack = ({ navigation }) => {
  return (
    <DetailsStack.Navigator screenOptions={mainPageOptionsNoUser}>
      <DetailsStack.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
      {/* User product screens  */}
      <DetailsStack.Screen
        name="Mitt upplagda återbruk"
        component={UserProductsScreen}
        options={mainPageOptionsNoUser}
      />
      <DetailsStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      {/* User project screens  */}
      <DetailsStack.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      {/* User proposal screens  */}
      <DetailsStack.Screen
        name="Alla mina efterlysningar"
        component={UserProposalsScreen}
        options={mainPageOptionsNoUser}
      />
      <DetailsStack.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </DetailsStack.Navigator>
  );
};

export default MyProfileStack;
