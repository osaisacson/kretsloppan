import React from 'react';

//Components
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatusBadge = (props) => {
  return (
    <View
      style={{
        borderRadius: 30,
        flex: 1,
        flexDirection: 'row',
        color: '#fff',
        width: props.width,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: props.backgroundColor,
      }}
    >
      <Ionicons
        style={{
          color: '#fff',
          paddingRight: 4,
        }}
        name={props.icon}
        size={20}
      />
      <Text
        style={{
          textTransform: 'uppercase',
          fontSize: 12,
          padding: 4,
          color: '#fff',
        }}
      >
        {props.text}
      </Text>
    </View>
  );
};

export default StatusBadge;
