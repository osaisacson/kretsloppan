import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
// import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
// import ProductsScreen from '../screens/shop/ProductsScreen';
// import ProjectsScreen from '../screens/shop/ProjectsScreen';
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions
} from '../screens/shop/ProductDetailScreen';
import UserProductsScreen, {
  screenOptions as userProductsScreenOptions
} from '../screens/user/UserProductsScreen';
import EditProductScreen, {
  screenOptions as editProductScreenOptions
} from '../screens/user/EditProductScreen';
import AuthScreen, {
  screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';
//Actions
import * as authActions from '../store/actions/auth';
//Constants
import Colors from '../constants/Colors';

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

// const Tab = createMaterialTopTabNavigator();

// export const ProductsTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       title="Egnahemsfabröken"
//       initialRouteName="Spotlight"
//       tabBarOptions={{
//         labelStyle: {
//           fontSize: 15,
//           fontFamily: 'roboto-regular',
//           textTransform: 'capitalize'
//         },
//         indicatorStyle: { backgroundColor: Colors.primary }
//       }}
//     >
//       <Tab.Screen name="Spotlight" component={SpotlightProductsScreen} />
//       <Tab.Screen name="Förråd" component={ProductsScreen} />
//       <Tab.Screen name="Projekt" component={ProjectsScreen} />
//     </Tab.Navigator>
//   );
// };
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
    </ProductsStackNavigator.Navigator>
  );
};

const AdminStackNavigator = createStackNavigator();

export const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen
        name="UserProducts"
        component={UserProductsScreen}
        options={userProductsScreenOptions}
      />
      <AdminStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
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

// const ProductsNavigator = createStackNavigator(
//   {
//     ProductsOverview: ProductsOverviewScreen,
//     Spotlight: SpotlightProductsScreen,
//     Products: ProductsScreen,
//     Projects: ProjectsScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const OrdersNavigator = createStackNavigator(
//   {
//     Orders: OrdersScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const AdminNavigator = createStackNavigator(
//   {
//     UserProducts: UserProductsScreen,
//     EditProduct: EditProductScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const AdminCategoriesNavigator = createStackNavigator(
//   {
//     Categories: CategoriesScreen,
//     EditCategory: EditCategoryScreen
//   },
//   {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const ShopNavigator = createDrawerNavigator(
//   {
//     Återbruk: ProductsNavigator,
//     Profil: AdminNavigator
//     // Bokat: OrdersNavigator,
//     // Kategorier: AdminCategoriesNavigator
//   },
//   {
//     contentOptions: {
//       activeTintColor: Colors.primary
//     },

//     contentComponent: props => {
//       const dispatch = useDispatch();
//       // const isAdmin = useSelector(
//       //   state => state.auth.userId === 'AzZYhb5h17dKiHfCdCYs7g2dwYo2' //NOTE: placeholder for setting admin, is now always set to the id associated with egnahemsfabriken@gmail.com
//       // );
//       return (
//         <View style={{ flex: 1, paddingTop: 20 }}>
//           <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
//             <UserAvatar
//               actionOnPress={() => {
//                 props.navigation.navigate('Bokat');
//                 props.navigation.closeDrawer();
//               }}
//             />
//             <Divider style={{ backgroundColor: 'grey' }} />
//             <DrawerNavigatorItems {...props} />
//             <Divider style={{ backgroundColor: 'grey' }} />
//             <Button
//               title="Logga ut"
//               color={Colors.primary}
//               onPress={() => {
//                 dispatch(authActions.logout());
//                 // props.navigation.navigate('Auth');
//               }}
//             />
//           </SafeAreaView>
//         </View>
//       );
//     }
//   }
// );

// const AuthNavigator = createStackNavigator(
//   {
//     Auth: AuthScreen
//   },
//   {
//     defaultNavigationOptions: defaultNavOptions
//   }
// );

// const MainNavigator = createSwitchNavigator({
//   Startup: StartupScreen,
//   Auth: AuthNavigator,
//   Shop: ShopNavigator
// });

// export default createAppContainer(MainNavigator);
