import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { Button } from 'react-native-elements';

const ButtonRound = ({ style, titleStyle, disabled, onSelect, title }) => {
  return (
    <>
      <Button
        raised
        disabled={disabled}
        containerStyle={{ borderRadius: 10 }}
        buttonStyle={{ ...styles.button, ...style }}
        titleStyle={{ ...styles.label, ...titleStyle }}
        title={title}
        onPress={onSelect}
      />
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
    width: 100,
    height: 100,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'bebas-neue-bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: Colors.neutral,
  },
  disabledLabel: {
    color: Colors.lightGrey,
  },
});

export default ButtonRound;
