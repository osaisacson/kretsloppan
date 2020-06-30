import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import Colors from '../constants/Colors';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';
import ProposalsScreen from '../screens/shop/ProposalsScreen';
import { topStackHeaderForTabs } from './NavHeaders';
import { SpotlightNavigator } from './SpotlightNavigator';

const TabStackNavigator = createMaterialBottomTabNavigator();

const DetailsStack = createStackNavigator();

const ProductsStack = ({ navigation }) => {
  return (
    <DetailsStack.Navigator screenOptions={topStackHeaderForTabs}>
      <DetailsStack.Screen name="Återbruk" component={ProductsScreen} />
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
        component={ProjectsScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => <Entypo name="tools" size={23} color={color} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Efterlysningar"
        unmountOnBlur
        component={ProposalsScreen}
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
