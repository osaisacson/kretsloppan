import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

//Screens
import AddButton from '../../components/UI/AddButton';
import SpotlightProductsScreen from './SpotlightProductsScreen';
import ProductsScreen from './ProductsScreen';
import ProjectsScreen from './ProjectsScreen';
import UserSpotlightScreen from './../user/UserSpotlightScreen';
import UserProductsScreen from './../user/UserProductsScreen';

//Constants
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <AddButton navigation={props.navigation} />
      <Tab.Navigator
        initialRouteName="Spotlight"
        labeled={false}
        shifting={true}
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: 'rgba(127,63,191,.9)' }}
      >
        <Tab.Screen
          name="Spotlight"
          component={SpotlightProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-star' : 'ios-star'}
                color={color}
                size={27}
                style={{
                  marginLeft: -20
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Förråd"
          component={ProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                color={color}
                size={27}
                style={{
                  marginLeft: -60
                }}
              />
            )
          }}
        />

        {/* <Tab.Screen name="Projekt" component={ProjectsScreen} /> */}
        <Tab.Screen
          name="Mitt Förråd"
          component={UserProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
                color={color}
                size={27}
                style={{
                  marginRight: -60
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Min Sida"
          component={UserSpotlightScreen}
          options={{
            tabBarBadge: 4,
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
                color={color}
                size={27}
                style={{
                  marginRight: -20
                }}
              />
            )
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: '',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

export default ProductsOverviewScreen;
