import React from 'react';
import { View, Text } from 'react-native';
import { Divider } from 'react-native-paper';

const StatusText = ({ label, text, textStyle }) => {
  return text ? (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 4,
          marginHorizontal: 10,
        }}>
        <Text style={{ fontFamily: 'roboto-light-italic' }}>{label}</Text>
        <Text style={[textStyle, { fontFamily: 'roboto-bold-italic' }]}>{text}</Text>
      </View>
      <Divider />
    </>
  ) : null;
};

export default StatusText;
