import { Ionicons } from '@expo/vector-icons';
import React from 'react';

//Imports
import { View, Text } from 'react-native';

const StatusBadge = (props) => {
  return (
    <View
      style={{
        ...props.style,
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        color: '#fff',
        marginBottom: 10,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: props.backgroundColor,
      }}>
      <Ionicons
        style={{
          color: '#fff',
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
            fontSize: 12,
            padding: 4,
            color: '#fff',
          },
        ]}>
        {props.text}
      </Text>
    </View>
  );
};

export default StatusBadge;
