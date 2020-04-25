import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  Entypo,
  MaterialIcons,
  AntDesign,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

//Components
import Error from '../components/UI/Error';
import Loader from '../components/UI/Loader';

//Tab screens
import { SpotlightNavigator } from './SpotlightNavigator';
import { ProductsNavigator } from './ProductsNavigator';
import { ProjectsNavigator } from './ProjectsNavigator';
import { ProposalsNavigator } from './ProposalsNavigator';

//Constants
import Colors from '../constants/Colors';

//Actions
import * as profilesActions from './../store/actions/profiles';
import * as productsActions from './../store/actions/products';
import * as projectsActions from './../store/actions/projects';
import * as proposalsActions from './../store/actions/proposals';

const TabStackNavigator = createMaterialBottomTabNavigator();

export const TabNavigator = (props) => {
  console.log('calling component TabNavigator');
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  //Load proposals
  const loadProfiles = useCallback(async () => {
    setError(null);
    try {
      console.log('TabNavigator: fetching profiles...');
      dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      console.log('Error in loadProfiles from TabNavigator ', err.message);
      setError(err.message);
    }
    console.log('...profiles fetched!');
  }, [setIsLoading, setError]);

  //Load products
  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      console.log('TabNavigator: fetching products...');
      dispatch(productsActions.fetchProducts());
    } catch (err) {
      console.log('Error in loadProducts from TabNavigator', err.message);
      setError(err.message);
    }
    console.log('...products fetched!');
  }, [setIsLoading, setError]);

  //Load projects
  const loadProjects = useCallback(async () => {
    setError(null);
    try {
      console.log('TabNavigator: fetching projects...');
      dispatch(projectsActions.fetchProjects());
    } catch (err) {
      console.log('Error in loadProjects from TabNavigator', err.message);
      setError(err.message);
    }
    console.log('...projects fetched!');
  }, [setIsLoading, setError]);

  //Load proposals
  const loadProposals = useCallback(async () => {
    setError(null);
    try {
      console.log('TabNavigator: fetching proposals...');
      dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      console.log('Error in loadProposals from TabNavigator ', err.message);
      setError(err.message);
    }
    console.log('...proposals fetched!');
  }, [setIsLoading, setError]);

  useEffect(() => {
    const unsubscribeProfiles = props.navigation.addListener(
      'focus',
      loadProfiles
    );
    const unsubscribeProducts = props.navigation.addListener(
      'focus',
      loadProducts
    );
    const unsubscribeProjects = props.navigation.addListener(
      'focus',
      loadProjects
    );
    const unsubscribeProposals = props.navigation.addListener(
      'focus',
      loadProposals
    );
    return () => {
      console.log(
        'UseEffect in TabNavigator: unsubscribing to loadProfiles, loadProducts, loadProjects, loadProposals'
      );
      unsubscribeProfiles();
      unsubscribeProducts();
      unsubscribeProjects();
      unsubscribeProposals();
    };
  }, [loadProducts, loadProjects, loadProposals]);

  useEffect(() => {
    console.log(
      'UseEffect in TabNavigator: setting isLoading to true while attempting to fetch profiles, products, projects and proposals.........................START'
    );
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
          console.log(
            '.................................END: UseEffect in TabNavigator: profiles, products, projects & proposals fetched, setting isLoading to false.'
          );
          setIsLoading(false);
        });
    }
    return () => (isMountedRef.current = false);
  }, [loadProfiles, loadProducts, loadProjects, loadProposals]);

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
    <TabStackNavigator.Navigator
      initialRouteName="Ge Igen"
      labeled={true}
      shifting={true}
      activeColor={Colors.lightPrimary}
      inactiveColor={Colors.mediumPrimary}
      barStyle={{ backgroundColor: Colors.darkPrimary }}
    >
      <TabStackNavigator.Screen
        name="Ge Igen"
        component={SpotlightNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name={'home'} color={color} size={23} />
          ),
        }}
      />
      <TabStackNavigator.Screen
        name="Återbruk"
        component={ProductsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name={'hammer'} color={color} size={23} />
          ),
        }}
      />
      <TabStackNavigator.Screen
        name="Projekt"
        component={ProjectsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name={'tools'} size={23} color={color} />
          ),
        }}
      />
      <TabStackNavigator.Screen
        name="Efterlysningar"
        component={ProposalsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name={'exclamationcircle'} color={color} size={23} />
          ),
        }}
      />
    </TabStackNavigator.Navigator>
  );
};
