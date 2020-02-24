import React from 'react';
import { TouchableOpacity } from 'react-native';

//Components
import { IconButton } from 'react-native-paper';

const ButtonIcon = props => {
  return (
    <TouchableOpacity
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      }}
    >
      <IconButton
        icon={props.icon}
        size={25}
        animated={true}
        color={'#fff'}
        style={{
          backgroundColor: props.color
        }}
        onPress={props.onSelect}
      />
    </TouchableOpacity>
  );
};

export default ButtonIcon;
