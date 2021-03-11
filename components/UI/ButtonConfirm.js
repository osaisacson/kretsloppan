import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import TouchableCmp from './TouchableCmp';

const ButtonConfirm = ({
  style,
  buttonColor,
  disabled,
  buttonLabelStyle,
  onSelect,
  icon,
  title,
}) => {
  return (
    <>
      {disabled ? (
        <Button
          color={buttonColor}
          disabled={disabled ? disabled : false}
          mode="contained"
          compact
          style={{ ...styles.button, ...style }}
          labelStyle={[styles.label, buttonLabelStyle]}
          onPress={onSelect}
          icon={icon}>
          {title}
        </Button>
      ) : (
        <TouchableCmp style={{ ...styles.container, ...style }}>
          <Button
            color={buttonColor}
            disabled={disabled ? disabled : false}
            mode="contained"
            compact
            style={{ ...styles.button, ...style }}
            labelStyle={[styles.label, buttonLabelStyle]}
            onPress={onSelect}
            icon={icon}>
            {title}
          </Button>
        </TouchableCmp>
      )}
    </>
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

export default ButtonConfirm;
