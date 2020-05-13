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
        transform: [{ rotate: '-.5deg' }],
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 15,
        paddingHorizontal: 10,
        backgroundColor: props.backgroundColor,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
