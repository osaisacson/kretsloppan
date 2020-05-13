import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
//Constants
import Colors from '../../constants/Colors';

export const FormFieldWrapper = (props) => {
  return (
    <View style={formStyles.formControl}>
      {props.label && (
        <Text style={formStyles.sectionLabel}>{props.label}</Text>
      )}
      {props.subLabel && (
        <Text style={formStyles.subLabel}>{props.subLabel}</Text>
      )}
      {props.children}
    </View>
  );
};

export const formStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formControl: {
    width: '100%',
  },
  sectionLabel: {
    fontFamily: 'roboto-light-italic',
    color: Colors.darkPrimary,
    alignSelf: 'center',
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 15,
  },
  multilineInput: {
    minHeight: 100, //... For dynamic height
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 15,
  },
  subLabel: {
    fontFamily: 'roboto-light-italic',
  },
});
