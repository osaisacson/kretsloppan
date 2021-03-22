import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import UserAvatar from './UserAvatar';
import Colors from '../../constants/Colors';

const UserAvatarWithBadge = ({ navigation, text, navigateTo, detailId, size }) => {
  return (
    <View style={[styles.textAndBadge, { justifyContent: 'flex-start' }]}>
      <UserAvatar
        size={size}
        userId={detailId}
        style={{ margin: 0 }}
        showBadge={false}
        actionOnPress={() => {
          navigation.navigate({ navigateTo }, { detailId: detailId });
        }}
      />
      <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -25 }]}>
        <Text style={styles.smallText}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textAndBadge: {
    flex: 1,
    flexDirection: 'row',
  },
  smallBadge: {
    zIndex: 10,
    paddingHorizontal: 2,
    borderRadius: 5,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
});

export default UserAvatarWithBadge;
