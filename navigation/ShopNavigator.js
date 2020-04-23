import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createDrawerNavigator,
  DrawerItemList,
} from '@react-navigation/drawer';

//Components
import Loader from '../components/UI/Loader';
import Error from '../components/UI/Error';
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
import * as profilesActions from '../store/actions/profiles';

//Constants
import Colors from '../constants/Colors';

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {
  const dispatch = useDispatch();

  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector((state) => state.auth.userId);
  const allProfiles = useSelector((state) => state.profiles.allProfiles);
  const [currentProfile, setCurrentProfile] = useState();
  const loadProfiles = useCallback(async () => {
    setError(null);
    try {
      console.log(
        'Fetching profiles in ShopNavigator, to load the data of the current user'
      );
      await dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProfiles()
        .then(() => {
          const getCurrentProfile = allProfiles.filter(
            (prof) => prof.profileId === loggedInUserId
          );
          setCurrentProfile(getCurrentProfile);
        })
        .then(() => {
          if (!currentProfile) {
            console.log('ShopNavigator: No profile loaded yet');
          }
          if (
            currentProfile &&
            currentProfile.image &&
            currentProfile.image.length > 100
          ) {
            console.log(
              'ShopNavigator: the image is bigger than 100 characters, length: ',
              currentProfile.image.length
            );
          }
          setIsLoading(false);
        });
    }
    return () => (isMountedRef.current = false);
  }, []); //Passing empty array means this only loads once after mount

  if (error) {
    return <Error actionOnPress={loadProfiles} />;
  }
  if (isLoading) {
    return <Loader />;
  }

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
