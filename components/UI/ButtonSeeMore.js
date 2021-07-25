import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Button } from 'react-native-paper';

const ButtonSeeMore = ({ onSelect, nrToShow }) => {
  return (
    <Button
      compact
      mode="contained"
      style={{
        marginTop: 5,
        marginHorizontal: 8,
      }}
      contentStyle={{
        height: 50,
        marginTop: 2,
      }}
      labelStyle={{
        fontFamily: 'roboto-bold',
        fontSize: 13,
      }}
      onPress={onSelect}>
      Se alla {nrToShow}
      <Feather name="arrow-right" />
    </Button>
  );
};

export default ButtonSeeMore;
