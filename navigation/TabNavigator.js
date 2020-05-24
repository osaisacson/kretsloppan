import { Entypo, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';

//Tab screens
import Colors from '../constants/Colors';
import { ProductsNavigator } from './ProductsNavigator';
import { ProjectsNavigator } from './ProjectsNavigator';
import { ProposalsNavigator } from './ProposalsNavigator';
import { SpotlightNavigator } from './SpotlightNavigator';

//Constants

const TabStackNavigator = createMaterialBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <TabStackNavigator.Navigator
      activeColor={Colors.lightPrimary}
      barStyle={{ backgroundColor: Colors.darkPrimary }}
      inactiveColor={Colors.lightPrimary}
      initialRouteName="Ge Igen"
      labeled
      shifting>
      <TabStackNavigator.Screen
        component={SpotlightNavigator}
        name="Ge Igen"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons color={color} name="home" size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        component={ProductsNavigator}
        name="Återbruk"
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 color={color} name="recycle" size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        component={ProjectsNavigator}
        name="Projekt"
        options={{
          tabBarIcon: ({ color }) => <Entypo color={color} name="tools" size={23} />,
        }}
      />
      <TabStackNavigator.Screen
        component={ProposalsNavigator}
        name="Efterlysningar"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons color={color} name="alert-decagram-outline" size={23} />
          ),
        }}
      />
    </TabStackNavigator.Navigator>
  );
};
