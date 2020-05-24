import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

//Tab screens
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/addAndEdit/EditProductScreen';
import EditProfileScreen, {
  screenOptions as editProfileScreenOptions,
} from '../screens/addAndEdit/EditProfileScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/addAndEdit/EditProjectScreen';
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions,
} from '../screens/details/ProductDetailScreen';
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import UserProfile from '../screens/details/UserProfile';
import ProductsScreen from '../screens/shop/ProductsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';
//Headers
import {
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';

//Details

//Edit screens

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        component={ProductsScreen}
        name="Återbruk"
        options={defaultMainPageOptions}
      />
      <ProductsStackNavigator.Screen
        component={UserSpotlightScreen}
        name="Min Sida"
        options={mainPageOptionsNoUser}
      />
      <ProductsStackNavigator.Screen
        component={UserProfile}
        name="Användare"
        options={mainPageOptionsWithUser}
      />
      <ProductsStackNavigator.Screen
        component={EditProfileScreen}
        name="EditProfile"
        options={editProfileScreenOptions}
      />
      {/* Details */}
      <ProductsStackNavigator.Screen
        component={ProductDetailScreen}
        name="ProductDetail"
        options={productDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen
        component={ProjectDetailScreen}
        name="ProjectDetail"
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <ProductsStackNavigator.Screen
        component={EditProductScreen}
        name="EditProduct"
        options={editProductScreenOptions}
      />
      <ProductsStackNavigator.Screen
        component={EditProjectScreen}
        name="EditProject"
        options={editProjectScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};
