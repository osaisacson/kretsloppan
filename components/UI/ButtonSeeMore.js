import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Button } from 'react-native-paper';

import Colors from './../../constants/Colors';

const ButtonSeeMore = ({ itemNr, onSelect }) => {
  return (
    <Button
      mode="outlined"
      compact
      style={{
        marginTop: 5,
        height: 30,
        borderColor: Colors.darkPrimary,
      }}
      labelStyle={{
        fontFamily: 'roboto-regular',
        fontSize: 11,
      }}
      onPress={onSelect}
      color={Colors.darkPrimary}>
      Se alla {itemNr} <Feather name="arrow-right" />
    </Button>
  );
};

export default ButtonSeeMore;
