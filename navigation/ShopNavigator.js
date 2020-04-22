import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';
//Components
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from './../components/UI/HeaderButton';
import { Platform, SafeAreaView, View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import {
  FontAwesome,
  Entypo,
  MaterialIcons,
  AntDesign,
} from '@expo/vector-icons';
import AddButton from '../components/UI/AddButton';
import UserAvatar from '../components/UI/UserAvatar';

//Tab screens
import SpotlightProductsScreen from '../screens/shop/SpotlightProductsScreen';
import ProjectsScreen from '../screens/shop/ProjectsScreen';
import ProposalsScreen from '../screens/shop/ProposalsScreen';
import UserSpotlightScreen from '../screens/user/UserSpotlightScreen';

//Details
import ProductDetailScreen, {
  screenOptions as productDetailScreenOptions,
} from '../screens/details/ProductDetailScreen';
import ProjectDetailScreen, {
  screenOptions as projectDetailScreenOptions,
} from '../screens/details/ProjectDetailScreen';
import ProposalDetailScreen, {
  screenOptions as proposalDetailScreenOptions,
} from '../screens/details/ProposalDetailScreen';
import ProfileDetailScreen, {
  screenOptions as profileDetailScreenOptions,
} from '../screens/details/ProfileDetailScreen';

//Edit/Add screens
import EditProductScreen, {
  screenOptions as editProductScreenOptions,
} from '../screens/addAndEdit/EditProductScreen';
import EditProjectScreen, {
  screenOptions as editProjectScreenOptions,
} from '../screens/addAndEdit/EditProjectScreen';
import EditProposalScreen, {
  screenOptions as editProposalScreenOptions,
} from '../screens/addAndEdit/EditProposalScreen';
import EditProfileScreen, {
  screenOptions as editProfileScreenOptions,
} from '../screens/addAndEdit/EditProfileScreen';
import AddProfileScreen from '../screens/addAndEdit/AddProfileScreen';
import AllProfilesScreen from '../screens/shop/AllProfilesScreen';

import AuthScreen, {
  screenOptions as authScreenOptions,
} from '../screens/user/AuthScreen';

//Actions
import * as authActions from '../store/actions/auth';

//Constants
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    height: 70,
  },
  headerTitleStyle: {
    fontFamily: 'roboto-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'roboto-regular',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

const defaultMainPageOptions = (navData) => {
  return {
    headerTitle: '',
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
        style={{ marginTop: 10, marginRight: 10 }}
        showBadge={true}
        actionOnPress={() => {
          navData.navigation.navigate('Min Sida');
        }}
      />
    ),
  };
};

const mainPageOptionsNoUser = (navData) => {
  return {
    headerTitle: '',
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
  };
};

const ProductsStackNavigator = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name="Products"
        component={SpotlightProductsScreen}
        options={defaultMainPageOptions}
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
      <ProductsStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
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
      <ProductsStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  );
};

const ProjectsStackNavigator = createStackNavigator();

export const ProjectsNavigator = () => {
  return (
    <ProjectsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProjectsStackNavigator.Screen
        name="Projects"
        component={ProjectsScreen}
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProjectsStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      {/* Edits */}
      <ProjectsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <ProjectsStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </ProjectsStackNavigator.Navigator>
  );
};

const ProposalsStackNavigator = createStackNavigator();

export const ProposalsNavigator = () => {
  return (
    <ProposalsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProposalsStackNavigator.Screen
        name="Proposals"
        component={ProposalsScreen}
        options={defaultMainPageOptions}
      />
      {/* Details */}
      <ProposalsStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
      {/* Edits */}
      <ProposalsStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <ProposalsStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </ProposalsStackNavigator.Navigator>
  );
};

const UserStackNavigator = createStackNavigator();

export const UserNavigator = () => {
  return (
    <UserStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <UserStackNavigator.Screen
        name="UserSpotlight"
        component={UserSpotlightScreen}
        options={mainPageOptionsNoUser}
      />
      <UserStackNavigator.Screen
        name="Profil"
        component={ProfileDetailScreen}
        options={profileDetailScreenOptions}
      />
      <UserStackNavigator.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={editProfileScreenOptions}
      />
      <UserStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      <UserStackNavigator.Screen
        name="EditProject"
        component={EditProjectScreen}
        options={editProjectScreenOptions}
      />
      <UserStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <UserStackNavigator.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
      <UserStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
      <UserStackNavigator.Screen
        name="EditProposal"
        component={EditProposalScreen}
        options={editProposalScreenOptions}
      />
    </UserStackNavigator.Navigator>
  );
};

const ProfilesStackNavigator = createStackNavigator();

export const ProfilesNavigator = () => {
  return (
    <ProfilesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProfilesStackNavigator.Screen
        name="AllProfiles"
        component={AllProfilesScreen}
        options={defaultMainPageOptions}
      />
      <ProfilesStackNavigator.Screen
        name="Profil"
        component={ProfileDetailScreen}
        options={profileDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProjectDetail"
        component={ProjectDetailScreen}
        options={projectDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <ProfilesStackNavigator.Screen
        name="ProposalDetail"
        component={ProposalDetailScreen}
        options={proposalDetailScreenOptions}
      />
    </ProfilesStackNavigator.Navigator>
  );
};

const TabStackNavigator = createMaterialBottomTabNavigator();

export const TabNavigator = (props) => {
  return (
    <>
      <AddButton navigation={props.navigation} />
      <TabStackNavigator.Navigator
        initialRouteName="Products"
        labeled={false}
        shifting={true}
        activeColor={Colors.lightPrimary}
        inactiveColor={Colors.mediumPrimary}
        barStyle={{ backgroundColor: Colors.darkPrimary }}
      >
        <TabStackNavigator.Screen
          name="Products"
          component={ProductsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name={'home'}
                color={color}
                size={27}
                style={{
                  marginLeft: -30,
                }}
              />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Projekt"
          component={ProjectsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo
                name={'tools'}
                size={27}
                color={color}
                style={{
                  marginLeft: -70,
                }}
              />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Efterlysningar"
          component={ProposalsNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <AntDesign
                name={'pushpin'}
                color={color}
                size={27}
                style={{
                  transform: [{ rotate: '90deg' }],
                  marginRight: -70,
                }}
              />
            ),
          }}
        />
        <TabStackNavigator.Screen
          name="Min Sida"
          component={UserNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name={'user'}
                color={color}
                size={30}
                style={{
                  marginRight: -200,
                }}
              />
            ),
          }}
        />
      </TabStackNavigator.Navigator>
    </>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <UserAvatar
                  showBadge={true}
                  // centralAvatar={true}
                  actionOnPress={() => {
                    props.navigation.navigate('Min Sida');
                    props.navigation.closeDrawer();
                  }}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    marginTop: 20,
                  }}
                >
                  Min sida
                </Text>
              </View>
              {/* <Text
                style={{
                  fontFamily: 'bebas-neue-bold',
                  fontSize: 25,
                  marginLeft: 10,
                  marginTop: 35
                }}
              >
                Ge igen
              </Text> */}
              <Divider style={{ marginTop: 10, backgroundColor: 'grey' }} />
              <DrawerItemList {...props} />
              <Divider style={{ marginTop: 10, backgroundColor: 'grey' }} />
              <Button
                color={'#666'}
                mode="contained"
                style={{
                  marginTop: 200,
                  width: '60%',
                  alignSelf: 'center',
                }}
                labelStyle={{
                  paddingTop: 2,
                  fontFamily: 'bebas-neue-bold',
                  fontSize: 14,
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
      initialRouteName={'Home'}
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Hem"
        component={TabNavigator}
        options={{
          drawerIcon: (props) => (
            <MaterialIcons name={'home'} size={23} color={props.color} />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Användare"
        component={ProfilesNavigator}
        options={{
          drawerIcon: (props) => (
            <FontAwesome name={'users'} size={23} color={props.color} />
          ),
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

export const emptyHeader = (navData) => {
  return {
    headerLeft: '',
    headerTitle: '',
    headerRight: '',
  };
};

const AuthProfileStackNavigator = createStackNavigator();

export const AuthProfileNavigator = () => {
  return (
    <AuthProfileStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
      }}
    >
      <AuthProfileStackNavigator.Screen
        name="AddProfile"
        component={AddProfileScreen}
        options={authScreenOptions}
      />
    </AuthProfileStackNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        headerStyle: {
          height: 0,
        },
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
