import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import firebase from 'firebase';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../components/UI/HeaderButton';
import UserAvatar from '../components/UI/UserAvatar';
import Colors from '../constants/Colors';

export const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Colors.darkPrimary,
  },
  headerTitleStyle: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
  },
  headerBackTitleStyle: {
    fontFamily: 'roboto-regular',
  },
  headerTintColor: '#fff',
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
      <View style={styles.avatarContainer}>
        <UserAvatar
          userId={firebase.auth().currentUser.uid}
          style={styles.userAvatar}
          showBadge
          actionOnPress={() => {
            navData.navigation.navigate('Min Sida');
          }}
        />
      </View>
    ),
  };
};

export const detailHeader = (navData) => {
  return {
    headerTitle: '',
  };
};

export const detailHeaderForTabs = (navData) => {
  return {
    headerBackTitle: 'Tillbaka',
    headerTitle: '',
  };
};

export const topStackHeaderForTabs = (navData) => {
  return {
    headerStyle: {
      backgroundColor: Colors.darkPrimary,
    },
    headerTitleStyle: {
      fontFamily: 'bebas-neue-bold',
      fontSize: 25,
    },
    headerBackTitleStyle: {
      fontFamily: 'roboto-regular',
    },
    headerTintColor: '#fff',
    headerRight: () => (
      <View style={styles.avatarContainer}>
        <UserAvatar
          style={styles.userAvatar}
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
          android: styles.avatarContainer,
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
    //     color={Colors.darkPrimary}
    //     borderColor={Colors.darkPrimary}
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
  avatarContainer: { marginRight: 10 },
  userAvatar: { marginRight: 10 },
});
