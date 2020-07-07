import React from 'react';
import * as Animatable from 'react-native-animatable';
import { Button } from 'react-native-paper';

import Colors from '../../constants/Colors';

const AnimatedButton = (props) => {
  return (
    <Animatable.View
      animation="flipInX"
      easing="ease-out"
      delay={500}
      duration={500}
      iterationCount={1}>
      <Button
        labelStyle={{ fontSize: 10 }}
        color={Colors.darkPrimary}
        style={{ width: '100%' }}
        mode="contained"
        onPress={props.onPress}>
        {props.text}
      </Button>
    </Animatable.View>
  );
};
export default AnimatedButton;
