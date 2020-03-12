import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

//Components
import { View, Text, Button, StyleSheet } from 'react-native';
import Loader from '../../components/UI/Loader';

//Screens
import AddButton from '../../components/UI/AddButton';
import SpotlightProductsScreen from './SpotlightProductsScreen';
import ProductsScreen from './ProductsScreen';
import ProjectsScreen from './ProjectsScreen';

import UserSpotlightScreen from '../user/UserSpotlightScreen';
import UserProductsScreen from '../user/UserProductsScreen';
import AddProfileScreen from '../addAndEdit/AddProfileScreen';

//Actions
import * as profilesActions from '../../store/actions/profiles';
//Constants
import Colors from '../../constants/Colors';

const BottomTabs = props => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const allProfiles = useSelector(state => state.profiles.allProfiles);
  const currentProfile = allProfiles.filter(
    prof => prof.profileId === loggedInUserId
  );

  const dispatch = useDispatch();

  const loadProfiles = useCallback(async () => {
    setError(null);
    try {
      await dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProfiles);
    return () => {
      unsubscribe();
    };
  }, [loadProfiles]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProfiles().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, []); //Passing empty array means this only loads once after mount

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProfiles}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  //If we don't have a profile, navigate to a screen where we add a profile.
  if (!isLoading && currentProfile.length === 0) {
    return (
      <AddProfileScreen navigation={props.navigation} route={props.route} />
    );
  }

  //Get down to business
  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <AddButton navigation={props.navigation} />
      <Tab.Navigator
        initialRouteName="Hem"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: 'rgba(127,63,191,.9)' }}
      >
        <Tab.Screen
          name="Hem"
          component={SpotlightProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-home' : 'ios-home'}
                color={color}
                size={27}
                style={
                  {
                    // marginLeft: -100
                  }
                }
              />
            )
          }}
        />
        <Tab.Screen
          name="Projekt"
          component={ProjectsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={Platform.OS === 'android' ? 'md-build' : 'ios-build'}
                color={color}
                size={27}
                style={{
                  marginLeft: -150
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Min Sida"
          component={UserSpotlightScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name={'user'}
                color={color}
                size={30}
                style={
                  {
                    // marginRight: -100
                  }
                }
              />
            )
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default BottomTabs;
