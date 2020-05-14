import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native';

//Components
import { IconButton } from 'react-native-paper';

const ButtonIcon = (props) => {
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
      <IconButton
        icon={props.icon}
        size={20}
        animated={true}
        color={'#fff'}
        style={{
          borderColor: '#fff',
          borderWidth: 0.5,
          backgroundColor: props.color,
        }}
        onPress={props.onSelect}
      />
    </TouchableCmp>
  );
};

export default ButtonIcon;
