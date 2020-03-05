import React, { useState, useEffect, useCallback } from 'react';
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
import UserSpotlightScreen from '../user/UserSpotlightScreen';
import UserProductsScreen from '../user/UserProductsScreen';
import EditProfileScreen from '../user/EditProfileScreen';

//Actions
import * as profilesActions from '../../store/actions/profiles';
//Constants
import Colors from '../../constants/Colors';

const BottomTabs = props => {
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
    setIsLoading(true);
    loadProfiles().then(() => {
      setIsLoading(false);
    });
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
      <EditProfileScreen navigation={props.navigation} route={props.route} />
    );
  }

  //Get down to business
  const Tab = createMaterialBottomTabNavigator();

  return (
    <>
      <AddButton navigation={props.navigation} />
      <Tab.Navigator
        initialRouteName="Spotlight"
        labeled={false}
        shifting={true}
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: 'rgba(127,63,191,.9)' }}
      >
        <Tab.Screen
          name="Spotlight"
          component={SpotlightProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={
                  Platform.OS === 'android'
                    ? 'md-notifications'
                    : 'ios-notifications'
                }
                color={color}
                size={27}
                style={{
                  marginLeft: -35
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Förråd"
          component={ProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name={'file-download'}
                color={color}
                size={27}
                style={{
                  marginLeft: -70
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Mitt Förråd"
          component={UserProductsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                name={'file-upload'}
                color={color}
                size={30}
                style={{
                  marginRight: -70
                }}
              />
            )
          }}
        />
        <Tab.Screen
          name="Min Sida"
          component={UserSpotlightScreen}
          options={{
            tabBarBadge: 4,
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name={'user'}
                color={color}
                size={30}
                style={{
                  marginRight: -35
                }}
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
