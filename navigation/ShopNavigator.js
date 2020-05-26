import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView, View, Platform } from 'react-native';
import { Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

//Actions
import Error from '../components/UI/Error';
import Loader from '../components/UI/Loader';
import UserAvatar from '../components/UI/UserAvatar';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import * as productsActions from './../store/actions/products';
import * as profilesActions from './../store/actions/profiles';
import * as projectsActions from './../store/actions/projects';
import * as proposalsActions from './../store/actions/proposals';
//Components
//Navigators
import { ProfilesNavigator } from './ProfilesNavigator';
import { TabNavigator } from './TabNavigator';

//Actions

//Constants

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = (props) => {
  console.log('Calling ShopNavigator');

  const dispatch = useDispatch();

  const isMountedRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Load profiles
  const loadProfiles = useCallback(async () => {
    setError(null);
    try {
      dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      console.log('Error in loadProfiles from ShopNavigator ', err.message);
      setError(err.message);
    }
  }, [dispatch]);

  //Load products
  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      dispatch(productsActions.fetchProducts());
    } catch (err) {
      console.log('Error in loadProducts from ShopNavigator', err.message);
      setError(err.message);
    }
  }, [dispatch]);

  //Load projects
  const loadProjects = useCallback(async () => {
    setError(null);
    try {
      dispatch(projectsActions.fetchProjects());
    } catch (err) {
      console.log('Error in loadProjects from ShopNavigator', err.message);
      setError(err.message);
    }
  }, [dispatch]);

  //Load proposals
  const loadProposals = useCallback(async () => {
    setError(null);
    try {
      dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      console.log('Error in loadProposals from ShopNavigator ', err.message);
      setError(err.message);
    }
  }, [dispatch]);

  //TODO: 1. Check if the below is necessary 2. If so, fix error undefined is not an object (evaluating 'navigation.addListener')
  // useEffect(() => {
  //   const unsubscribeProfiles = props.navigation.addListener(
  //     'focus',
  //     loadProfiles
  //   );
  //   const unsubscribeProducts = props.navigation.addListener(
  //     'focus',
  //     loadProducts
  //   );
  //   const unsubscribeProjects = props.navigation.addListener(
  //     'focus',
  //     loadProjects
  //   );
  //   const unsubscribeProposals = props.navigation.addListener(
  //     'focus',
  //     loadProposals
  //   );
  //   return () => {
  //     console.log(
  //       'UseEffect in ShopNavigator: unsubscribing to loadProfiles, loadProducts, loadProjects, loadProposals'
  //     );
  //     unsubscribeProfiles();
  //     unsubscribeProducts();
  //     unsubscribeProjects();
  //     unsubscribeProposals();
  //   };
  // }, [loadProfiles, loadProducts, loadProjects, loadProposals]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProfiles()
        .then(() => {
          loadProducts();
        })
        .then(() => {
          loadProjects();
        })
        .then(() => {
          loadProposals();
        })
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return () => (isMountedRef.current = false);
  }, [dispatch]);

  //Error handling
  if (error) {
    return (
      <>
        <Error actionOnPress={loadProfiles} />
        <Error actionOnPress={loadProducts} />
        <Error actionOnPress={loadProjects} />
        <Error actionOnPress={loadProposals} />
      </>
    );
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <View
                  style={Platform.select({
                    default: { paddingTop: 20 },
                    android: {
                      paddingTop: 20,
                      paddingLeft: 10,
                    },
                  })}>
                  <UserAvatar
                    showBadge
                    actionOnPress={() => {
                      props.navigation.navigate('Min Sida');
                      props.navigation.closeDrawer();
                    }}
                  />
                </View>
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
            </SafeAreaView>
          </View>
        );
      }}
      initialRouteName="Home"
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}>
      <ShopDrawerNavigator.Screen
        name="Ge Igen"
        component={TabNavigator}
        options={{
          drawerIcon: (props) => <MaterialIcons name="home" size={23} color={props.color} />,
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Användare"
        component={ProfilesNavigator}
        options={{
          drawerIcon: (props) => <FontAwesome name="users" size={23} color={props.color} />,
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};
