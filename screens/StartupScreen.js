import React, { useEffect, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage,
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import useAsyncEffect from '../hooks/useAsyncEffect';
import { Notifications } from 'expo'

const StartupScreen = (props) => {
  const isMountedRef = useRef(null);
  const dispatch = useDispatch();

  useAsyncEffect(async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    if (isMountedRef.current) {
      const tryLogin = async () => {
        const userData = await AsyncStorage.getItem('userData');
        //If we can't find user data stored on the device dispatch the action:
        if (!userData) {
          dispatch(authActions.setDidTryAutoLogin());
          return;
        }
        const transformedData = JSON.parse(userData);
        const { token, userId, expiryDate } = transformedData;
        const expirationDate = new Date(expiryDate);
        //If we find data but the token is expired, we dispatch an action:
        if (expirationDate <= new Date() || !token || !userId) {
          dispatch(authActions.setDidTryAutoLogin());
          return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();
        //If we instead succeed and have a valid token then we go to the shop page
        //We dispatch an action where we authenticate the user, which changes data in our redux store (sets the token, etc. the token is originally null)
        dispatch(authActions.authenticate(userId, token, expirationTime));
      };

      tryLogin();
    }
    return () => (isMountedRef.current = false);
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupScreen;
