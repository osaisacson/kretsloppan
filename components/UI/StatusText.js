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
          paddingHorizontal: 10,
          width: '100%',
        }}>
        <Text style={{ fontFamily: 'roboto-light-italic', maxWidth: '50%' }}>{label}</Text>
        <Text
          style={[
            textStyle,
            { textAlign: 'right', fontFamily: 'roboto-bold-italic', maxWidth: '50%' },
          ]}>
          {text}
        </Text>
      </View>
      <Divider />
    </>
  ) : null;
};

export default StatusText;
