import React from 'react';
//Components
import { Platform, StyleSheet, View } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../components/UI/HeaderButton';
import UserAvatar from '../components/UI/UserAvatar';
//Constants
import Colors from '../constants/Colors';

export const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
    height: 90,
  },
  headerTitleStyle: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
  },
  headerBackTitleStyle: {
    fontFamily: 'roboto-regular',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
};

export const defaultMainPageOptions = (navData) => {
  return {
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
    ),
    headerRight: () => (
      <View
        style={Platform.select({
          android: styles.userAvatar,
        })}>
        <UserAvatar
          style={Platform.select({ ios: styles.userAvatar })}
          showBadge
          actionOnPress={() => {
            navData.navigation.navigate('Min Sida');
          }}
        />
      </View>
    ),
  };
};

export const mainPageOptionsWithUser = (navData) => {
  return {
    headerTitle: '',
    headerRight: () => (
      <View
        style={Platform.select({
          android: styles.userAvatar,
        })}>
        <UserAvatar
          style={Platform.select({ ios: styles.userAvatar })}
          showBadge
          actionOnPress={() => {
            navData.navigation.navigate('Min Sida');
          }}
        />
      </View>
    ),
  };
};

export const mainPageOptionsNoUser = () => {
  return {
    headerTitle: '',
    headerRight: '',
    // headerRight: () => (
    //   <ButtonIcon
    //     badge={2} //TBD: In-app messaging - should show nr of unanswered messages
    //     style={{ marginRight: 30, marginTop: 5 }}
    //     icon="email"
    //     color={Colors.primary}
    //     borderColor={Colors.primary}
    //     size={24}
    //   />
    // ),
  };
};

export const emptyHeader = (navData) => {
  return {
    headerLeft: '',
    headerTitle: '',
    headerRight: '',
  };
};

const styles = StyleSheet.create({
  userAvatar: { marginTop: 15, marginRight: 10 },
});
