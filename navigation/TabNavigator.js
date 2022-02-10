import React from 'react';
import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import usePopToTopOnBlur from '../hooks/usePopToTopOnBlur';
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/EditProductScreen';
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
import ProjectsList from '../screens/ProjectsList';
import ProposalsList from '../screens/ProposalsList';
import UserSpotlightScreen from '../screens/UserSpotlightScreen';
import { topStackHeaderForTabs, detailHeaderForTabs, mainPageOptionsNoUser } from './NavHeaders';
import { SpotlightNavigator } from './SpotlightNavigator';

const TabStackNavigator = createMaterialBottomTabNavigator();

const DetailsStack = createStackNavigator();

// We need all screens accessible from each of the below stacks defined specifically in each stack,
// otherwise the back button defaults to taking us back to the spotlightNavigator stack instead.
const ProductsStack = ({ navigation }) => {
  usePopToTopOnBlur(navigation, 'Återbruk');

  return (
    <DetailsStack.Navigator screenOptions={topStackHeaderForTabs}>
      <DetailsStack.Screen name="Allt återbruk" component={ProductsList} />
      <DetailsStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <DetailsStack.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
    </DetailsStack.Navigator>
  );
};

const ProjectsStack = ({ navigation }) => {
  usePopToTopOnBlur(navigation, 'Projekt');

  return (
    <DetailsStack.Navigator screenOptions={topStackHeaderForTabs}>
      <DetailsStack.Screen name="Alla projekt" component={ProjectsList} />
      <DetailsStack.Screen
        name="ProjectDetail"
        component={ProjectDetail}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <DetailsStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <DetailsStack.Screen
        name="ProposalDetail"
        component={ProposalDetail}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
      <DetailsStack.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
    </DetailsStack.Navigator>
  );
};

const ProposalsStack = ({ navigation }) => {
  usePopToTopOnBlur(navigation, 'Efterlysningar');

  return (
    <DetailsStack.Navigator screenOptions={topStackHeaderForTabs}>
      <DetailsStack.Screen name="Alla efterlysningar" component={ProposalsList} />
      <DetailsStack.Screen
        name="ProposalDetail"
        component={ProposalDetail}
        options={detailHeaderForTabs}
      />
      <DetailsStack.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
      <DetailsStack.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
    </DetailsStack.Navigator>
  );
};

export const TabNavigator = ({ navigation }) => {
  return (
    <TabStackNavigator.Navigator
      initialRouteName="Kretsloppan"
      labeled
      shifting
      activeColor={Colors.lightPrimary}
      inactiveColor={Colors.lightPrimary}
      barStyle={{ backgroundColor: Colors.darkPrimary }}>
      <TabStackNavigator.Screen
        unmountOnBlur
        name="Kretsloppan"
        component={SpotlightNavigator}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Återbruk"
        unmountOnBlur
        component={ProductsStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome5 name="recycle" color={color} size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Projekt"
        unmountOnBlur
        component={ProjectsStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => <Entypo name="tools" size={23} color={color} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Efterlysningar"
        unmountOnBlur
        component={ProposalsStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="alert-decagram-outline" color={color} size={23} />
          ),
        }}
      />
    </TabStackNavigator.Navigator>
  );
};
