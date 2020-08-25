import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Button } from 'react-native-paper';

import Colors from './../../constants/Colors';

const ButtonSeeMore = ({ onSelect }) => {
  return (
    <Button
      mode="outlined"
      compact
      style={{
        marginTop: 5,
        borderColor: Colors.darkPrimary,
      }}
      contentStyle={{
        height: 30,
        marginTop: 2,
      }}
      labelStyle={{
        fontFamily: 'roboto-regular',
        fontSize: 11,
      }}
      onPress={onSelect}
      color={Colors.darkPrimary}>
      Se alla <Feather name="arrow-right" />
    </Button>
  );
};

export default ButtonSeeMore;
