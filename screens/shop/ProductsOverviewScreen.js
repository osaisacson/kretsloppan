import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import UserAvatar from '../../components/UI/UserAvatar';
import HeaderButton from '../../components/UI/HeaderButton';

//Screens
import SpotlightProductsScreen from './SpotlightProductsScreen';
import ProductsScreen from './ProductsScreen';
import ProjectsScreen from './ProjectsScreen';

//Constants
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Spotlight"
      tabBarOptions={{
        labelStyle: {
          fontSize: 15,
          fontFamily: 'roboto-regular',
          textTransform: 'capitalize'
        },
        indicatorStyle: { backgroundColor: Colors.primary }
      }}
    >
      <Tab.Screen name="Spotlight" component={SpotlightProductsScreen} />
      <Tab.Screen name="Förråd" component={ProductsScreen} />
      <Tab.Screen name="Projekt" component={ProjectsScreen} />
    </Tab.Navigator>
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: 'Allt Återbruk',
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
    ),
    headerRight: () => (
      <UserAvatar
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Admin');
        }}
      />
    )
  };
};

export default ProductsOverviewScreen;
