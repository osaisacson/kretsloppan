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
        name="Efterlysningar"
        component={ProposalsScreen}
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProposalsStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
      {/* Edits */}
      <ProposalsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </ProposalsStackNavigator.Navigator>
  );
};
