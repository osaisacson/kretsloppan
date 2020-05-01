import React from 'react';
//Components
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Button } from 'react-native-paper';

const ButtonToggle = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <TouchableCmp
      style={{
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
      <Button
        mode="contained"
        compact={props.isLarge ? false : true}
        style={{
          alignSelf: 'center',
        }}
        labelStyle={{
          paddingTop: 4,
          paddingBottom: 2,
          fontFamily: 'bebas-neue-bold',
          fontSize: 12,
        }}
        onPress={props.onSelect}
        icon={props.icon}
      >
        {props.title}
      </Button>
    </TouchableCmp>
  );
};

export default ButtonToggle;
