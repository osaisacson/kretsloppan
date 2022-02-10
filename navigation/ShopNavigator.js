import React, { useEffect, useState } from 'react';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/Colors';
import WalkthroughScreen from '../screens/WalkthroughScreen';
import * as authActions from '../store/actions/auth';
import * as ordersActions from '../store/actions/orders';
import * as productsActions from '../store/actions/products';
import * as profilesActions from '../store/actions/profiles';
import * as projectsActions from '../store/actions/projects';
import * as proposalsActions from '../store/actions/proposals';
import { AboutNavigator } from './AboutNavigator';
import { ProfilesNavigator } from './ProfilesNavigator';
import { TabNavigator } from './TabNavigator';

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const hasWalkedThrough = currentProfile.hasWalkedThrough;

  console.log('Calling ShopNavigator');
  console.log(`Profile of current user ${currentProfile ? 'exists' : 'does not exist yet'}`);
  console.log(
    `${currentProfile ? 'and the status of hasWalkedThrough is: ' + hasWalkedThrough : ''}`
  );

  const loadAppData = async () => {
    try {
      console.log('Fetching app data.........');
      const allPromises = await Promise.all([
        dispatch(profilesActions.fetchProfiles()),
        dispatch(productsActions.fetchProducts()),
        dispatch(projectsActions.fetchProjects()),
        dispatch(proposalsActions.fetchProposals()),
        dispatch(ordersActions.fetchOrders()),
      ]);
      return allPromises;
    } catch (error) {
      console.log('Error in attempting to fetch app data, ShopNavigator.js', error);
    } finally {
      setIsLoaded(true);
      console.log('.........all app data loaded in ShopNavigator.js!');
    }
  };

  useEffect(() => {
    loadAppData();
  }, [isLoaded]);

  const dispatch = useDispatch();

  if (!isLoaded) {
    return null;
  }

  if (!hasWalkedThrough || hasWalkedThrough === 'undefined') {
    return <WalkthroughScreen currUserId={currentProfile.id} />;
  }

  return (
    <ShopDrawerNavigator.Navigator
      lazy
      openByDefault={false}
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <View style={{ marginTop: 30 }}>
                <Divider style={{ backgroundColor: 'grey' }} />
                <DrawerItemList {...props} />
                <Divider style={{ marginTop: 10, backgroundColor: 'grey' }} />
                <Button
                  color="#666"
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
                  compact
                  onPress={() => {
                    dispatch(authActions.logout());
                  }}>
                  Logga ut
                </Button>
              </View>
            </SafeAreaView>
          </View>
        );
      }}
      initialRouteName="Kretsloppan"
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}>
      <ShopDrawerNavigator.Screen
        name="Kretsloppan"
        component={TabNavigator}
        options={{
          drawerIcon: (props) => (
            <MaterialCommunityIcons name="home" size={23} color={props.color} />
          ),
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Användare"
        component={ProfilesNavigator}
        options={{
          drawerIcon: (props) => <FontAwesome name="users" size={23} color={props.color} />,
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Om oss"
        component={AboutNavigator}
        options={{
          drawerIcon: (props) => (
            <FontAwesome name="question-circle" size={26} color={props.color} />
          ),
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};
