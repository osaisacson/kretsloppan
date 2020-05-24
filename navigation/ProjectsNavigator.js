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
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';
import { defaultNavOptions, defaultMainPageOptions } from './NavHeaders';

const ProjectsStackNavigator = createStackNavigator();

export const ProjectsNavigator = () => {
  return (
    <ProjectsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProjectsStackNavigator.Screen
        component={ProjectsScreen}
        name="Projekt"
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProjectsStackNavigator.Screen
        component={ProjectDetailScreen}
        name="ProjectDetail"
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <ProjectsStackNavigator.Screen
        component={EditProductScreen}
        name="EditProduct"
        options={editProductScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        component={EditProjectScreen}
        name="EditProject"
        options={editProjectScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        component={EditProposalScreen}
        name="EditProposal"
        options={editProposalScreenOptions}
      />
    </ProjectsStackNavigator.Navigator>
  );
};
