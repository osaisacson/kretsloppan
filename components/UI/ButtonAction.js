import React from 'react';
//Components
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import { Button } from 'react-native-paper';

const ButtonAction = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }
  return (
    <TouchableCmp style={{ ...styles.container, ...props.style }}>
      <Button
        disabled={props.disabled ? props.disabled : false}
        mode="contained"
        compact={props.isLarge ? false : true}
        style={styles.button}
        labelStyle={styles.label}
        onPress={props.onSelect}
        icon={props.icon}
      >
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
