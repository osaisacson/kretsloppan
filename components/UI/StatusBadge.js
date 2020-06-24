import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

const StatusBadge = (props) => {
  const statusText = props.text.toLowerCase(); //Make moment() text lowercase
  const statusTextFormatted = statusText.charAt(0).toUpperCase() + statusText.slice(1); //Make first letter of sentence uppercase

  return (
    <View
      style={{
        ...props.style,
        borderRadius: props.noCorners ? 0 : 5,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: props.backgroundColor,
      }}>
      <Ionicons
        style={{
          color: props.textColor ? props.textColor : '#fff',
          paddingRight: 4,
        }}
        name={props.icon}
        size={16}
      />
      <Text
        style={[
          props.textStyle,
          {
            fontFamily: props.boldText ? 'roboto-bold-italic' : 'roboto-light-italic',
            fontSize: 12,
            padding: 4,
            color: props.textColor ? props.textColor : '#fff',
          },
        ]}>
        {statusTextFormatted}
      </Text>
    </View>
  );
};

export default StatusBadge;
