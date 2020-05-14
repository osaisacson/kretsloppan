import React from 'react';
//Components
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Button } from 'react-native-paper';

const ButtonAction = (props) => {
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
        disabled={props.disabled ? props.disabled : false}
        mode="contained"
        compact={props.isLarge ? false : true}
        style={{
          minWidth: 100,
          alignSelf: 'center',
        }}
        labelStyle={{
          fontFamily: 'roboto-regular',
          fontSize: 9,
        }}
        onPress={props.onSelect}
        icon={props.icon}
      >
        {props.title}
      </Button>
    </TouchableCmp>
  );
};

export default ButtonAction;
