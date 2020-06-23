import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import { AboutNavigator } from './AboutNavigator';
import { ProfilesNavigator } from './ProfilesNavigator';
import { TabNavigator } from './TabNavigator';

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = (props) => {
  console.log('Calling ShopNavigator');

  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
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
      initialRouteName="Home"
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
