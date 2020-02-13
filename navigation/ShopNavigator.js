import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {
  createDrawerNavigator,
  DrawerNavigatorItems
} from 'react-navigation-drawer';
//Components
import { Platform, SafeAreaView, Button, View } from 'react-native';
import UserAvatar from '../components/UI/UserAvatar';
import { Divider } from 'react-native-elements';
//Icons
import { Ionicons } from '@expo/vector-icons';
//Screens
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
import ProductsScreen from '../screens/shop/ProductsScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';

import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import CategoriesScreen from '../screens/user/CategoriesScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditCategoryScreen from '../screens/user/EditCategoryScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
//Constants
import Colors from '../constants/Colors';
//Actions
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'roboto-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'roboto-regular'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    Spotlight: SpotlightProductsScreen,
    Products: ProductsScreen,
    Projects: ProjectsScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const AdminCategoriesNavigator = createStackNavigator(
  {
    Categories: CategoriesScreen,
    EditCategory: EditCategoryScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: defaultNavOptions
  }
);

const ShopNavigator = createDrawerNavigator(
  {
    Återbruk: ProductsNavigator,
    Profil: AdminNavigator,
    Bokat: OrdersNavigator,
    Kategorier: AdminCategoriesNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },

    contentComponent: props => {
      const dispatch = useDispatch();
      // const isAdmin = useSelector(
      //   state => state.auth.userId === 'AzZYhb5h17dKiHfCdCYs7g2dwYo2' //NOTE: placeholder for setting admin, is now always set to the id associated with egnahemsfabriken@gmail.com
      // );
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <UserAvatar
              actionOnPress={() => {
                props.navigation.navigate('Bokat');
                props.navigation.closeDrawer();
              }}
            />
            <Divider style={{ backgroundColor: 'grey' }} />
            <DrawerNavigatorItems {...props} />
            <Divider style={{ backgroundColor: 'grey' }} />
            <Button
              title="Logga ut"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator
});

export default createAppContainer(MainNavigator);
