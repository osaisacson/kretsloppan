import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
//Components
import FormErrorText from './../UI/FormErrorText';

export const FormFieldWrapper = props => {
  return (
    <View style={formStyles.formControl}>
      <Text style={formStyles.label}>{props.label}</Text>
      {props.subLabel ? (
        <Text style={formStyles.subLabel}>{props.subLabel}</Text>
      ) : null}
      {props.children}
      {props.showPromptIf ? <FormErrorText errorText={props.prompt} /> : null}
    </View>
  );
};

export const formStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    width: '100%'
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  label: {
    fontFamily: 'roboto-bold',
    marginVertical: 8
  },
  subLabel: {
    fontFamily: 'roboto-light-italic'
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});
