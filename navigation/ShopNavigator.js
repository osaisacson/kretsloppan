import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from './../components/UI/HeaderButton';
import { Platform, SafeAreaView, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
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

import EditProfileScreen, {
  screenOptions as editProfileScreenOptions
} from '../screens/user/EditProfileScreen';

import AllProfilesScreen from '../screens/shop/AllProfilesScreen';

import AuthScreen, {
  screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';

//Actions
import * as authActions from '../store/actions/auth';

//Constants
import Colors from '../constants/Colors';
import AddProfileScreen from '../screens/user/AddProfileScreen';
import { NavigationEvents } from 'react-navigation';

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

export const noItemsScreenOptions = navData => {
  return {
    headerRight: '',
    headerTitle: '',
    headerLeft: ''
  };
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
        name="AddProfile"
        component={AddProfileScreen}
        options={noItemsScreenOptions}
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
        name="EditProfile"
        component={EditProfileScreen}
        options={editProfileScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const UsersStackNavigator = createStackNavigator();

export const UsersNavigator = () => {
  return (
    <UsersStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <UsersStackNavigator.Screen
        name="AllProfiles"
        component={AllProfilesScreen}
        options={productsOverviewScreenOptions}
      />
      <UsersStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
    </UsersStackNavigator.Navigator>
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
        onPress={() => {
          props.navigation.popToTop();
        }}
        options={{
          drawerIcon: props => (
            <Entypo name={'tools'} size={23} color={props.color} />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Users"
        component={UsersNavigator}
        options={{
          drawerIcon: props => (
            <FontAwesome name={'users'} size={23} color={props.color} />
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
