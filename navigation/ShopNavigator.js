import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
//Components
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../components/UI/UserAvatar';

//Screens
import ProductsOverviewScreen, {
  screenOptions as productsOverviewScreenOptions
} from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions
} from '../screens/shop/ProductDetailScreen';
import UserOverviewScreen, {
  screenOptions as userOverviewScreenOptions
} from '../screens/user/UserOverviewScreen';
import EditProductScreen, {
  screenOptions as editProductScreenOptions
} from '../screens/user/EditProductScreen';
import EditUserScreen, {
  screenOptions as editUserScreenOptions
} from '../screens/user/EditUserScreen';
import AuthScreen, {
  screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';
//Actions
import * as authActions from '../store/actions/auth';
//Constants
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    height: 100
  },
  headerTitleStyle: {
    marginTop: 10,
    fontFamily: 'roboto-bold'
  },
  headerBackTitleStyle: {
    marginTop: 10,
    fontFamily: 'roboto-regular'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
        options={productsOverviewScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen
        name="UserOverview"
        component={UserOverviewScreen}
        options={userOverviewScreenOptions}
      />
      <AdminStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <AdminStackNavigator.Screen
        name="EditUser"
        component={EditUserScreen}
        options={editUserScreenOptions}
      />
    </AdminStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <UserAvatar
                actionOnPress={() => {
                  props.navigation.navigate('Admin');
                  props.navigation.closeDrawer();
                }}
              />
              <Divider style={{ backgroundColor: 'grey' }} />
              <DrawerItemList {...props} />
              <Button
                title="Logga ut"
                color={Colors.primary}
                onPress={() => {
                  dispatch(authActions.logout());
                }}
              />
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
              size={23}
              color={props.color}
            />
          )
        }}
      />

      <ShopDrawerNavigator.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
