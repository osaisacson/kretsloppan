import React from 'react';
import { View, Text } from 'react-native';

const StatusText = ({ style, label, text, textStyle }) => {
  return (
    <View
      style={{
        flex: style ? null : 1,
        flexDirection: style ? null : 'row',
        justifyContent: style ? null : 'space-between',
        marginVertical: 4,
        marginHorizontal: 10,
      }}>
      <Text
        style={[
          style,
          {
            fontFamily: 'roboto-light-italic',
          },
        ]}>
        {label}
      </Text>
      <Text
        style={[
          textStyle,
          {
            fontFamily: 'roboto-bold-italic',
          },
        ]}>
        {text}
      </Text>
    </View>
  );
};

export default StatusText;
