import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Headers
import { defaultNavOptions, defaultMainPageOptions } from './NavHeaders';

//Tab screens
import ProjectsScreen from '../screens/shop/ProjectsScreen';

//Details
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';

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

const ProjectsStackNavigator = createStackNavigator();

export const ProjectsNavigator = () => {
  return (
    <ProjectsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProjectsStackNavigator.Screen
        name="Projekt"
        component={ProjectsScreen}
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProjectsStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <ProjectsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </ProjectsStackNavigator.Navigator>
  );
};
