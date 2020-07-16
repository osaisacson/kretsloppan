import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

const StatusBadge = ({
  style,
  noCorners,
  backgroundColor,
  text,
  textColor,
  icon,
  textStyle,
  boldText,
}) => {
  const statusText = text.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted = statusText.charAt(0).toUpperCase() + statusText.slice(1); //Make first letter of sentence uppercase
  const backgroundColorLocal = backgroundColor;
  return (
    <View
      style={{
        ...style,
        borderRadius: noCorners ? 0 : 5,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: backgroundColorLocal,
      }}>
      <Ionicons
        style={{
          color: textColor ? textColor : '#fff',
          paddingRight: 4,
        }}
        name={icon}
        size={16}
      />
      <Text
        style={[
          textStyle,
          {
            fontFamily: boldText ? 'roboto-bold-italic' : 'roboto-light-italic',
            fontSize: 12,
            padding: 4,
            color: textColor ? textColor : '#fff',
          },
        ]}>
        {statusTextFormatted}
      </Text>
    </View>
  );
};

export default StatusBadge;
