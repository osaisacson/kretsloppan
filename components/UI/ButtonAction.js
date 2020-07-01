import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import TouchableCmp from './TouchableCmp';

const ButtonAction = (props) => {
  return (
    <TouchableCmp style={{ ...styles.container, ...props.style }}>
      <Button
        color={props.buttonColor}
        disabled={props.disabled ? props.disabled : false}
        mode="contained"
        compact
        style={{ ...styles.button, ...props.style }}
        labelStyle={[styles.label, props.buttonLabelStyle]}
        onPress={props.onSelect}
        icon={props.icon}>
        {props.title}
      </Button>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    minWidth: 100,
    alignSelf: 'center',
  },
  label: {
    fontFamily: 'roboto-regular',
    fontSize: 9,
  },
});

export default ButtonAction;
