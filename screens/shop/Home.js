import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

//Tab screens
import ProductsScreen from './ProductsScreen';
import ProjectsScreen from './ProjectsScreen';
import AddButton from '../../components/UI/AddButton';
import ProposalsScreen from './ProposalsScreen';
import UserSpotlightScreen from '../user/UserSpotlightScreen';

//Constants
import Colors from '../../constants/Colors';

const Home = props => {
  //Get down to business
  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <AddButton navigation={props.navigation} />
      <Tab.Navigator
        initialRouteName="Hem"
        labeled={false}
        shifting={true}
        activeColor={Colors.lightPrimary}
        inactiveColor={Colors.mediumPrimary}
        barStyle={{ backgroundColor: Colors.darkPrimary }}
      >
        <Tab.Screen
          name="Hem"
          component={ProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
                color={color}
                size={27}
                style={{
                  marginLeft: -30
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Projekt"
          component={ProjectsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-build' : 'ios-build'}
                color={color}
                size={27}
                style={{
                  marginLeft: -70
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Efterlysningar"
          component={ProposalsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={
                  Platform.OS === 'android'
                    ? 'md-notifications'
                    : 'ios-notifications'
                }
                color={color}
                size={27}
                style={{
                  marginRight: -70
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Min Sida"
          component={UserSpotlightScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name={'user'}
                color={color}
                size={30}
                style={{
                  marginRight: -30
                }}
              />
            )
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Home;
