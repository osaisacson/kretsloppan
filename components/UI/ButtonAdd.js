import React from 'react';
import { Button } from 'react-native-paper';

import Colors from './../../constants/Colors';

const ButtonAdd = (props) => {
  return (
    <Button
      style={{ ...props.style }}
      labelStyle={{ marginLeft: 4, paddingRight: 0, fontSize: 10, ...props.style }}
      icon="plus"
      color={Colors.darkPrimary}
      mode="contained"
      onPress={props.onPress}>
      {props.title}
    </Button>
  );
};

export default ButtonAdd;
