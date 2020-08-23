import React from 'react';
import { View, Text } from 'react-native';

const StatusText = ({ style, label, text }) => {
  const statusText = text.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted = statusText.charAt(0).toUpperCase() + statusText.slice(1); //Make first letter of sentence uppercase
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
            fontFamily: 'roboto-light-italic',
          },
        ]}>
        {statusTextFormatted}
      </Text>
    </View>
  );
};

export default StatusText;
