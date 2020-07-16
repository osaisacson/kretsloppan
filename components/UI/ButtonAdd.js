import React from 'react';
import { Button } from 'react-native-paper';

import Colors from './../../constants/Colors';

const ButtonAdd = ({ style, onPress, title }) => {
  return (
    <Button
      style={{ ...style }}
      labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10, ...style }}
      icon="plus"
      color={Colors.darkPrimary}
      mode="contained"
      onPress={onPress}>
      {title}
    </Button>
  );
};

export default ButtonAdd;
