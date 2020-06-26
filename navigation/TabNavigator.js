import { Entypo, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';

import Colors from '../constants/Colors';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';
import ProposalsScreen from '../screens/shop/ProposalsScreen';
import {
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';
import { SpotlightNavigator } from './SpotlightNavigator';
const TabStackNavigator = createMaterialBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <TabStackNavigator.Navigator
      initialRouteName="Kretsloppan"
      labeled
      shifting
      activeColor={Colors.lightPrimary}
      inactiveColor={Colors.lightPrimary}
      barStyle={{ backgroundColor: Colors.darkPrimary }}>
      <TabStackNavigator.Screen
        name="Kretsloppan"
        component={SpotlightNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Återbruk"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="recycle" color={color} size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Projekt"
        component={ProjectsScreen}
        options={{
          tabBarIcon: ({ color }) => <Entypo name="tools" size={23} color={color} />,
        }}
      />
      <TabStackNavigator.Screen
        name="Efterlysningar"
        component={ProposalsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="alert-decagram-outline" color={color} size={23} />
          ),
        }}
      />
    </TabStackNavigator.Navigator>
  );
};
