import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text } from 'react-native';

const StatusBadge = (props) => {
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
            textTransform: 'uppercase',
            fontSize: 10,
            padding: 4,
            color: props.textColor ? props.textColor : '#fff',
          },
        ]}>
        {props.text}
      </Text>
    </View>
  );
};

export default StatusBadge;
