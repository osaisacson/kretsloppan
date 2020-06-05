import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import Colors from '../../constants/Colors';

const ActionLine = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        backgroundColor: Colors.lightPrimary,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      }}>
      <Text
        style={{
          color: Colors.darkPrimary,
          fontSize: 16,
        }}>
        Visa{' '}
      </Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          backgroundColor: Colors.indicator,
          borderRadius: 50,
        }}>
        <Text style={{ color: '#fff' }}>{props.badgeNr}</Text>
      </View>
      <Text
        style={{
          color: Colors.darkPrimary,
          fontSize: 16,
        }}>
        {' '}
        saker som väntar på din review
      </Text>
    </TouchableOpacity>
  );
};

export default ActionLine;
