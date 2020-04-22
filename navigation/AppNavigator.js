import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import {
  ShopNavigator,
  AuthNavigator,
  AuthProfileNavigator,
} from './ShopNavigator';
//Components
import Loader from '../components/UI/Loader';
import Error from '../components/UI/Error';
//Screens
import StartupScreen from '../screens/StartupScreen';

//Actions
import * as profilesActions from '../store/actions/profiles';

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector((state) => state.auth.userId);
  const allProfiles = useSelector((state) => state.profiles.allProfiles);
  const currentProfile = allProfiles.filter(
    (prof) => prof.profileId === loggedInUserId
  );

  const dispatch = useDispatch();

  const loadProfiles = useCallback(async () => {
    setError(null);
    try {
      console.log(
        'Loading profiles in AppNavigator, to check if the logged in user has a profile yet. Should only run once.'
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
      loadProfiles().then(() => {
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
    <NavigationContainer>
      {isAuth && currentProfile.length === 0 && <AuthProfileNavigator />}
      {isAuth && currentProfile.length > 0 && <ShopNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
