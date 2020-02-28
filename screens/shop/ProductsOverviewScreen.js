import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

//Components
import { View, Text, Button, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import Loader from '../../components/UI/Loader';

//Screens
import AddButton from '../../components/UI/AddButton';
import SpotlightProductsScreen from './SpotlightProductsScreen';
import ProductsScreen from './ProductsScreen';
import UserSpotlightScreen from './../user/UserSpotlightScreen';
import UserProductsScreen from './../user/UserProductsScreen';
import AddProfileScreen from '../user/AddProfileScreen';

//Actions
import * as profilesActions from '../../store/actions/profiles';
//Constants
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const allProfiles = useSelector(state => state.profiles.allProfiles);
  const currentProfile = useSelector(
    state => state.profiles.allProfiles
  ).filter(prof => prof.profileId === loggedInUserId);

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
    setIsLoading(true);
    loadProfiles().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProfiles]);

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
    return <AddProfileScreen navigation={props.navigation} />;
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

export const screenOptions = navData => {
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
    )
  };
};

export default ProductsOverviewScreen;
