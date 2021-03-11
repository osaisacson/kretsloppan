import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

const ButtonRound = ({ style, disabled, small, onSelect, title }) => {
  return (
    <>
      {disabled ? (
        <View onPress={onSelect} style={{ ...styles.button, ...styles.disabledButton, ...style }}>
          <Text style={{ ...styles.disabledLabel, ...styles.label }}>{title}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onSelect} style={{ ...styles.button, ...style }}>
          <Text style={{ ...styles.label }}>{title}</Text>
        </TouchableOpacity>
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
    marginTop: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  label: {
    paddingTop: 8,
    paddingHorizontal: 5,
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
