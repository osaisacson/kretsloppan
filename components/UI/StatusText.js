import React from 'react';
import { View, Text } from 'react-native';

const StatusText = ({ style, label, text, noTextFormatting }) => {
  const statusText = text.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted = noTextFormatting
    ? text
    : statusText.charAt(0).toUpperCase() + statusText.slice(1); //Make first letter of sentence uppercase
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
          style,
          {
            fontFamily: 'roboto-bold-italic',
          },
        ]}>
        {statusTextFormatted}
      </Text>
    </View>
  );
};

export default StatusText;
