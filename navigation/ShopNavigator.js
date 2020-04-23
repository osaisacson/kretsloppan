import React from 'react';
import { useDispatch } from 'react-redux';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';
//Components
import { SafeAreaView, View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import UserAvatar from '../components/UI/UserAvatar';

//Navigators
import { TabNavigator } from './TabNavigator';
import { ProfilesNavigator } from './ProfilesNavigator';

//Actions
import * as authActions from '../store/actions/auth';

//Constants
import Colors from '../constants/Colors';

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
        name="Ge Igen"
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
