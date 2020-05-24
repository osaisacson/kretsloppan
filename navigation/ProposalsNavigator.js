import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Headers

//Tab screens

//Details

//Edit screens
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/addAndEdit/EditProductScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/addAndEdit/EditProjectScreen';
import EditProposalScreen, {
  screenOptions as editProposalScreenOptions,
} from '../screens/addAndEdit/EditProposalScreen';
import ProposalDetailScreen, {
  screenOptions as proposalDetailScreenOptions,
} from '../screens/details/ProposalDetailScreen';
import ProposalsScreen from '../screens/shop/ProposalsScreen';
import { defaultNavOptions, defaultMainPageOptions } from './NavHeaders';

const ProposalsStackNavigator = createStackNavigator();

export const ProposalsNavigator = () => {
  return (
    <ProposalsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProposalsStackNavigator.Screen
        component={ProposalsScreen}
        name="Efterlysningar"
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProposalsStackNavigator.Screen
        component={ProposalDetailScreen}
        name="ProposalDetail"
        options={proposalDetailScreenOptions}
      />
      {/* Edits */}
      <ProposalsStackNavigator.Screen
        component={EditProductScreen}
        name="EditProduct"
        options={editProductScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        component={EditProjectScreen}
        name="EditProject"
        options={editProjectScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        component={EditProposalScreen}
        name="EditProposal"
        options={editProposalScreenOptions}
      />
    </ProposalsStackNavigator.Navigator>
  );
};
