import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

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
import {
  defaultNavOptions,
  defaultMainPageOptions,
  mainPageOptionsNoUser,
  mainPageOptionsWithUser,
} from './NavHeaders';

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name="Återbruk"
        component={ProductsScreen}
        options={defaultMainPageOptions}
      />
      <ProductsStackNavigator.Screen
        name="Min Sida"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
      <ProductsStackNavigator.Screen
        name="Användare"
        component={UserProfile}
        options={mainPageOptionsWithUser}
      />
      <ProductsStackNavigator.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={editProfileScreenOptions}
      />
      {/* Details */}
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
      {/* Edits */}
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
    </ProductsStackNavigator.Navigator>
  );
};
