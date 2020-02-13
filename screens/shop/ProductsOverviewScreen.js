import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HeaderButton from '../../components/UI/HeaderButton';

//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../../components/UI/UserAvatar';
import SpotlightProductsScreen from './SpotlightProductsScreen';
import ProductsScreen from './ProductsScreen';
import ProjectsScreen from './ProjectsScreen';

const ProductsOverviewScreen = props => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Spotlight" component={SpotlightProductsScreen} />
        <Tab.Screen name="Förråd" component={ProductsScreen} />
        <Tab.Screen name="Projekt" component={ProjectsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Allt Återbruk',
    headerLeft: (
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
    headerRight: (
      <UserAvatar
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Profil');
        }}
      />
    )
  };
};

export default ProductsOverviewScreen;
