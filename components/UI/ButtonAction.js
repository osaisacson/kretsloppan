import React from 'react';
//Components
import { Platform, TouchableOpacity, TouchableNativeFeedback, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const ButtonAction = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <TouchableCmp style={{ ...styles.container, ...props.style }}>
      <Button
        color={props.buttonColor}
        compact={!props.isLarge}
        disabled={props.disabled ? props.disabled : false}
        icon={props.icon}
        labelStyle={[styles.label, props.buttonLabelStyle]}
        mode="contained"
        onPress={props.onSelect}
        style={styles.button}>
        {props.title}
      </Button>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    minWidth: 100,
  },
  container: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontFamily: 'roboto-regular',
    fontSize: 9,
  },
});

export default ButtonAction;
