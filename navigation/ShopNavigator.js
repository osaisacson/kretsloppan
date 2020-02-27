import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
//Components
import { Platform, SafeAreaView, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from '../components/UI/UserAvatar';
import { Button } from 'react-native-paper';

//Screens
import ProductsOverviewScreen, {
  screenOptions as productsOverviewScreenOptions
} from '../screens/shop/ProductsOverviewScreen';

import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions
} from '../screens/shop/ProductDetailScreen';
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions
} from '../screens/shop/ProjectDetailScreen';

import EditProductScreen, {
  screenOptions as editProductScreenOptions
} from '../screens/user/EditProductScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions
} from '../screens/user/EditProjectScreen';

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
    height: 70
  },
  headerTitleStyle: {
    fontFamily: 'roboto-bold'
  },
  headerBackTitleStyle: {
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
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name="EditUser"
        component={EditUserScreen}
        options={editUserScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <UserAvatar
                actionOnPress={() => {
                  props.navigation.closeDrawer();
                }}
              />
              <Divider style={{ marginTop: 10, backgroundColor: 'grey' }} />
              <DrawerItemList {...props} />
              <Button
                color={'#666'}
                mode="contained"
                style={{
                  marginTop: 200,
                  width: '60%',
                  alignSelf: 'center'
                }}
                labelStyle={{
                  paddingTop: 2,
                  fontFamily: 'bebas-neue-bold',
                  fontSize: 14
                }}
                compact={true}
                onPress={() => {
                  dispatch(authActions.logout());
                }}
              >
                Logga ut
              </Button>
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
    </ShopDrawerNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0
        }
      }}
    >
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
