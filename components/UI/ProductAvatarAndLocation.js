import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { pure } from 'recompose';
import moment from 'moment/min/moment-with-locales';

import UserAvatar from './UserAvatar';

const ProductAvatarAndLocation = ({ navigation, itemData }) => {
  const { ownerId, location, date } = itemData;
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <UserAvatar
        size={40}
        userId={ownerId}
        actionOnPress={() => {
          navigation.navigate('Användare', {
            detailId: ownerId,
          });
        }}
      />
      <View style={styles.locationAndDate}>
        {location ? (
          <Text
            style={{
              ...styles.cursiveAndRight,
              marginTop: 10,
            }}>
            {location}
          </Text>
        ) : null}
        {date ? (
          <Text
            style={{
              ...styles.cursiveAndRight,
              fontSize: 12,
            }}>
            {moment(date).locale('sv').format('D MMMM HH:mm')}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cursiveAndRight: {
    fontFamily: 'roboto-light-italic',
    textAlign: 'right',
  },
});

export default pure(ProductAvatarAndLocation);
